#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Master Bot Controller for Parallel Execution
class MasterBotController {
  constructor() {
    this.bots = [
      {
        name: 'Layout Redesign Bot',
        script: 'bot-layout-redesign.js',
        phase: 1,
        description: 'Redesigning Weekly Plan timeline layout'
      },
      {
        name: 'Workout Database Bot',
        script: 'bot-workout-database.js',
        phase: 2,
        description: 'Generating 165+ workouts across 11 categories'
      },
      {
        name: 'Meal Flow Bot',
        script: 'bot-meal-flow.js',
        phase: 3,
        description: 'Creating structured meal selection flow'
      },
      {
        name: 'Card Design Bot',
        script: 'bot-card-design.js',
        phase: 4,
        description: 'Implementing expandable card components'
      },
      {
        name: 'Responsive Design Bot',
        script: 'bot-responsive-design.js',
        phase: 5,
        description: 'Optimizing mobile responsiveness'
      },
      {
        name: 'Integration Bot',
        script: 'bot-integration.js',
        phase: 6,
        description: 'Integrating all components and testing'
      }
    ];
    this.results = [];
    this.startTime = Date.now();
  }

  async executeBots() {
    console.log('🚀 Master Bot Controller Starting...');
    console.log('═══════════════════════════════════════════');
    console.log(`⏰ Start Time: ${new Date().toLocaleTimeString()}`);
    console.log(`📦 Total Bots: ${this.bots.length}`);
    console.log('═══════════════════════════════════════════\n');

    // Execute all bots in parallel
    const promises = this.bots.map(bot => this.runBot(bot));
    
    try {
      const results = await Promise.all(promises);
      this.displayResults(results);
    } catch (error) {
      console.error('❌ Error during parallel execution:', error);
      process.exit(1);
    }
  }

  runBot(bot) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      console.log(`🤖 Starting ${bot.name} (Phase ${bot.phase})`);
      console.log(`   📋 ${bot.description}`);

      // Simulate bot execution
      const botProcess = spawn('node', [path.join(__dirname, bot.script)], {
        stdio: 'pipe',
        env: { ...process.env, BOT_NAME: bot.name }
      });

      let output = '';
      let errorOutput = '';

      botProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      botProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      botProcess.on('close', (code) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        if (code === 0) {
          console.log(`✅ ${bot.name} completed in ${duration}s`);
          resolve({
            bot: bot.name,
            phase: bot.phase,
            status: 'success',
            duration,
            output
          });
        } else {
          console.error(`❌ ${bot.name} failed with code ${code}`);
          reject({
            bot: bot.name,
            phase: bot.phase,
            status: 'failed',
            error: errorOutput || `Process exited with code ${code}`
          });
        }
      });

      botProcess.on('error', (err) => {
        console.error(`❌ Failed to start ${bot.name}:`, err.message);
        reject({
          bot: bot.name,
          phase: bot.phase,
          status: 'error',
          error: err.message
        });
      });
    });
  }

  displayResults(results) {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n═══════════════════════════════════════════');
    console.log('📊 EXECUTION SUMMARY');
    console.log('═══════════════════════════════════════════');
    
    results.forEach(result => {
      console.log(`\nPhase ${result.phase}: ${result.bot}`);
      console.log(`  Status: ✅ ${result.status}`);
      console.log(`  Duration: ${result.duration}s`);
    });

    console.log('\n═══════════════════════════════════════════');
    console.log(`⏱️  Total Execution Time: ${totalDuration}s`);
    console.log(`🎯 All ${results.length} bots completed successfully!`);
    console.log('═══════════════════════════════════════════\n');

    // Save results to file
    this.saveResults(results, totalDuration);
  }

  saveResults(results, totalDuration) {
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration,
      botsExecuted: results.length,
      results: results.map(r => ({
        bot: r.bot,
        phase: r.phase,
        status: r.status,
        duration: r.duration
      }))
    };

    import('fs').then(fs => {
      fs.writeFileSync(
        path.join(__dirname, 'bot-execution-report.json'),
        JSON.stringify(report, null, 2)
      );
      console.log('📄 Execution report saved to bot-execution-report.json');
    });
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const controller = new MasterBotController();
  controller.executeBots().catch(console.error);
}

export default MasterBotController;