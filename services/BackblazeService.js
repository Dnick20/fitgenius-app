// Backblaze B2 Storage Service for FitGenius
const https = require('https');

class BackblazeService {
  constructor() {
    this.applicationKeyId = '0055791d364659800000000003';
    this.applicationKey = 'K005fXaQ4F3PxMEtlsmHTwGCRBB0PS8';
    this.bucketName = 'fitgenius-storage';
    this.bucketId = '55e7c9a1bd43460496950918';
    this.apiUrl = 'https://api.backblazeb2.com';
    this.downloadUrl = 'https://f005.backblazeb2.com';
    
    this.authToken = null;
    this.uploadUrl = null;
    this.uploadAuthToken = null;
  }

  async authorize() {
    try {
      console.log('🔐 Authorizing with Backblaze B2...');
      
      const authString = Buffer.from(`${this.applicationKeyId}:${this.applicationKey}`).toString('base64');
      
      const response = await this.makeRequest('POST', `${this.apiUrl}/b2api/v2/b2_authorize_account`, {}, {
        'Authorization': `Basic ${authString}`
      });

      this.authToken = response.authorizationToken;
      this.apiUrl = response.apiUrl;
      this.downloadUrl = response.downloadUrl;

      console.log('✅ Backblaze authorization successful');
      return response;
    } catch (error) {
      console.error('❌ Backblaze authorization failed:', error);
      throw error;
    }
  }

  async getUploadUrl() {
    try {
      if (!this.authToken) {
        await this.authorize();
      }

      const response = await this.makeRequest('POST', `${this.apiUrl}/b2api/v2/b2_get_upload_url`, {
        bucketId: this.bucketId
      }, {
        'Authorization': this.authToken
      });

      this.uploadUrl = response.uploadUrl;
      this.uploadAuthToken = response.authorizationToken;

      return response;
    } catch (error) {
      console.error('❌ Failed to get upload URL:', error);
      throw error;
    }
  }

  async uploadFile(fileName, fileData, contentType = 'application/octet-stream') {
    try {
      if (!this.uploadUrl || !this.uploadAuthToken) {
        await this.getUploadUrl();
      }

      console.log(`📤 Uploading file: ${fileName}`);

      const fileHash = this.calculateSHA1(fileData);
      
      const response = await this.makeRequest('POST', this.uploadUrl, fileData, {
        'Authorization': this.uploadAuthToken,
        'X-Bz-File-Name': encodeURIComponent(fileName),
        'Content-Type': contentType,
        'Content-Length': fileData.length,
        'X-Bz-Content-Sha1': fileHash
      }, true);

      console.log(`✅ File uploaded: ${fileName}`);
      return {
        fileId: response.fileId,
        fileName: response.fileName,
        url: `${this.downloadUrl}/file/${this.bucketName}/${fileName}`,
        contentType: response.contentType,
        contentLength: response.contentLength
      };
    } catch (error) {
      console.error(`❌ File upload failed for ${fileName}:`, error);
      throw error;
    }
  }

  async uploadUserProfileImage(userId, imageData, fileName) {
    const imagePath = `users/${userId}/profile/${fileName}`;
    return await this.uploadFile(imagePath, imageData, 'image/jpeg');
  }

  async uploadWorkoutVideo(userId, videoData, fileName) {
    const videoPath = `users/${userId}/workouts/${fileName}`;
    return await this.uploadFile(videoPath, videoData, 'video/mp4');
  }

  async backupDatabase() {
    try {
      console.log('💾 Starting database backup...');
      
      const { exec } = require('child_process');
      const fs = require('fs');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const backupFileName = `fitgenius_backup_${timestamp}.sql.gz`;
      const localBackupPath = `/tmp/${backupFileName}`;

      // Create compressed database backup
      const command = `export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH" && pg_dump -h localhost -d fitgenius | gzip > ${localBackupPath}`;
      
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Backup creation failed:', error);
            reject(error);
          } else {
            console.log('✅ Database backup created locally');
            resolve();
          }
        });
      });

      // Upload backup to Backblaze
      const backupData = fs.readFileSync(localBackupPath);
      const uploadResult = await this.uploadFile(`backups/${backupFileName}`, backupData, 'application/gzip');

      // Clean up local backup file
      fs.unlinkSync(localBackupPath);

      console.log('✅ Database backup uploaded to Backblaze');
      return uploadResult;
    } catch (error) {
      console.error('❌ Database backup failed:', error);
      throw error;
    }
  }

  async listFiles(prefix = '') {
    try {
      if (!this.authToken) {
        await this.authorize();
      }

      const response = await this.makeRequest('POST', `${this.apiUrl}/b2api/v2/b2_list_file_names`, {
        bucketId: this.bucketId,
        startFileName: prefix,
        maxFileCount: 1000
      }, {
        'Authorization': this.authToken
      });

      return response.files.map(file => ({
        fileName: file.fileName,
        fileId: file.fileId,
        size: file.size,
        uploadTimestamp: file.uploadTimestamp,
        url: `${this.downloadUrl}/file/${this.bucketName}/${file.fileName}`
      }));
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw error;
    }
  }

  async deleteFile(fileName) {
    try {
      if (!this.authToken) {
        await this.authorize();
      }

      // First get file info
      const files = await this.listFiles(fileName);
      const file = files.find(f => f.fileName === fileName);
      
      if (!file) {
        throw new Error(`File not found: ${fileName}`);
      }

      const response = await this.makeRequest('POST', `${this.apiUrl}/b2api/v2/b2_delete_file_version`, {
        fileId: file.fileId,
        fileName: fileName
      }, {
        'Authorization': this.authToken
      });

      console.log(`✅ File deleted: ${fileName}`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to delete file ${fileName}:`, error);
      throw error;
    }
  }

  calculateSHA1(data) {
    const crypto = require('crypto');
    return crypto.createHash('sha1').update(data).digest('hex');
  }

  async makeRequest(method, url, data = null, headers = {}, isBinary = false) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Content-Type': isBinary ? 'application/octet-stream' : 'application/json',
          ...headers
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const parsedData = responseData ? JSON.parse(responseData) : {};
              resolve(parsedData);
            } else {
              const error = responseData ? JSON.parse(responseData) : { message: 'Unknown error' };
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || error.code}`));
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse response: ${parseError.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        if (isBinary) {
          req.write(data);
        } else {
          req.write(JSON.stringify(data));
        }
      }
      
      req.end();
    });
  }

  // Test connection method
  async testConnection() {
    try {
      console.log('🧪 Testing Backblaze connection...');
      await this.authorize();
      
      // Test upload with a small file
      const testData = Buffer.from('FitGenius Backblaze Test File');
      const testResult = await this.uploadFile('test/connection_test.txt', testData, 'text/plain');
      
      // Clean up test file
      await this.deleteFile('test/connection_test.txt');
      
      console.log('✅ Backblaze connection test successful');
      return { success: true, message: 'Backblaze B2 integration working correctly' };
    } catch (error) {
      console.error('❌ Backblaze connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = BackblazeService;