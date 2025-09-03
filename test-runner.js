#!/usr/bin/env node

/**
 * Test Runner for UserSimulationBot
 * Executes comprehensive user journey testing
 */

const { execSync } = require('child_process');
const path = require('path');

class TestRunner {
  constructor() {
    this.projectPath = process.cwd();
    this.devServerUrl = 'http://localhost:4000';
  }

  async run() {
    console.log('🚀 Starting FitGenius Test Suite');
    console.log('=' .repeat(50));
    
    try {
      // Check if dev server is running
      await this.checkDevServer();
      
      // Install Playwright browsers if needed
      await this.setupPlaywright();
      
      // Run UserSimulationBot tests
      await this.runUserSimulationTests();
      
      console.log('\n✅ Test suite completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async checkDevServer() {
    console.log('🔍 Checking development server...');
    
    try {
      const { spawn } = require('child_process');
      const curl = spawn('curl', ['-s', this.devServerUrl]);
      
      return new Promise((resolve, reject) => {
        curl.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Development server is running');
            resolve();
          } else {
            console.log('⚠️  Development server not detected');
            console.log('   Please ensure "npm run dev" is running in another terminal');
            console.log('   Server should be available at: http://localhost:4000');
            reject(new Error('Development server not running'));
          }
        });
      });
    } catch (error) {
      throw new Error('Unable to check development server status');
    }
  }

  async setupPlaywright() {
    console.log('🔧 Setting up Playwright browsers...');
    
    try {
      execSync('npx playwright install', { 
        stdio: 'inherit',
        cwd: this.projectPath 
      });
      console.log('✅ Playwright browsers installed');
    } catch (error) {
      throw new Error('Failed to install Playwright browsers');
    }
  }

  async runUserSimulationTests() {
    console.log('🧪 Running UserSimulationBot tests...');
    
    // Create a simple test execution script
    const testScript = `
      import UserSimulationBot from './src/bots/UserSimulationBot.js';
      
      async function runTests() {
        const bot = new UserSimulationBot();
        const results = await bot.runAllTests();
        const report = bot.generateReport(results);
        
        console.log('\\n📋 Detailed Test Report:');
        console.log(JSON.stringify(report, null, 2));
        
        // Save report
        const fs = require('fs');
        fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
        console.log('\\n💾 Report saved to test-report.json');
        
        return results;
      }
      
      runTests().catch(console.error);
    `;
    
    // Write temporary test script
    const fs = require('fs');
    const testScriptPath = path.join(this.projectPath, 'run-tests.mjs');
    fs.writeFileSync(testScriptPath, testScript);
    
    try {
      // Execute test script
      execSync('node run-tests.mjs', { 
        stdio: 'inherit',
        cwd: this.projectPath 
      });
      
      console.log('✅ UserSimulationBot tests completed');
      
      // Clean up
      fs.unlinkSync(testScriptPath);
      
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(testScriptPath)) {
        fs.unlinkSync(testScriptPath);
      }
      throw new Error('UserSimulationBot tests failed');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch((error) => {
    console.error('Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = TestRunner;