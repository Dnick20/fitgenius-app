// Vercel API Route: File Upload to Backblaze B2
const BackblazeService = require('../services/BackblazeService');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData, userId, fileType = 'general' } = req.body;

    if (!fileName || !fileData || !userId) {
      return res.status(400).json({ 
        error: 'fileName, fileData, and userId are required' 
      });
    }

    const backblaze = new BackblazeService();
    
    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');
    
    let uploadResult;
    
    // Route to appropriate upload method based on file type
    switch (fileType) {
      case 'profile':
        uploadResult = await backblaze.uploadUserProfileImage(userId, buffer, fileName);
        break;
      case 'workout':
        uploadResult = await backblaze.uploadWorkoutVideo(userId, buffer, fileName);
        break;
      default:
        uploadResult = await backblaze.uploadFile(`users/${userId}/${fileName}`, buffer);
    }

    res.status(200).json({
      success: true,
      file: uploadResult
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
}