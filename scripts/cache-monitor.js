#!/usr/bin/env node
/**
 * Cache Monitor & Management Tool
 * Intelligent Next.js cache management to prevent corruption
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CacheMonitor {
  constructor() {
    this.nextDir = path.join(process.cwd(), '.next');
    this.maxCacheSize = 500 * 1024 * 1024; // 500MB
    this.corruptionIndicators = [
      'app-build-manifest.json',
      'build-manifest.json',
      'server-reference-manifest.json'
    ];
  }

  // Check cache health
  checkHealth() {
    if (!fs.existsSync(this.nextDir)) {
      console.log('✅ No cache directory - clean state');
      return { healthy: true, size: 0, issues: [] };
    }

    const size = this.getCacheSize();
    const issues = [];

    // Check size
    if (size > this.maxCacheSize) {
      issues.push(`Cache too large: ${this.formatSize(size)}`);
    }

    // Check for corruption indicators
    for (const file of this.corruptionIndicators) {
      const filePath = path.join(this.nextDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const stat = fs.statSync(filePath);
          if (stat.size === 0) {
            issues.push(`Empty manifest: ${file}`);
          }
        } catch (err) {
          issues.push(`Corrupted manifest: ${file}`);
        }
      }
    }

    // Check for webpack-hmr conflicts
    const hmrPath = path.join(this.nextDir, 'server', 'webpack-hmr');
    if (fs.existsSync(hmrPath)) {
      const hmrFiles = fs.readdirSync(hmrPath);
      if (hmrFiles.length > 50) {
        issues.push(`Too many HMR files: ${hmrFiles.length}`);
      }
    }

    return {
      healthy: issues.length === 0,
      size,
      issues
    };
  }

  // Get cache directory size
  getCacheSize() {
    if (!fs.existsSync(this.nextDir)) return 0;
    
    let totalSize = 0;
    
    const calculateSize = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        try {
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            calculateSize(itemPath);
          } else {
            totalSize += stat.size;
          }
        } catch (err) {
          // Skip files that can't be accessed
        }
      }
    };
    
    try {
      calculateSize(this.nextDir);
    } catch (err) {
      console.warn(`Warning: Could not calculate cache size - ${err.message}`);
    }
    
    return totalSize;
  }

  // Clear cache intelligently
  clearCache() {
    if (!fs.existsSync(this.nextDir)) {
      console.log('✅ No cache to clear');
      return;
    }

    console.log('🧹 Clearing Next.js cache...');
    
    try {
      // Stop any running dev servers first
      try {
        if (process.platform === 'win32') {
          execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
        } else {
          execSync('pkill -f "next dev"', { stdio: 'ignore' });
        }
        console.log('🛑 Stopped running Next.js processes');
      } catch (err) {
        // No processes to kill
      }

      // Wait a moment for processes to fully stop
      setTimeout(() => {
        this.removeDirectory(this.nextDir);
        console.log('✅ Cache cleared successfully');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error clearing cache:', err.message);
      console.log('💡 Try running: npm run dev:clean');
    }
  }

  // Remove directory recursively (Windows-safe)
  removeDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'ignore' });
      } else {
        execSync(`rm -rf "${dirPath}"`, { stdio: 'ignore' });
      }
    } catch (err) {
      // Fallback to manual removal
      this.removeDirectoryManual(dirPath);
    }
  }

  // Manual directory removal fallback
  removeDirectoryManual(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      try {
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          this.removeDirectoryManual(itemPath);
        } else {
          fs.unlinkSync(itemPath);
        }
      } catch (err) {
        // Skip files that can't be removed
      }
    }
    
    try {
      fs.rmdirSync(dirPath);
    } catch (err) {
      // Directory might not be empty
    }
  }

  // Monitor cache continuously
  startMonitoring() {
    console.log('👀 Starting cache monitoring...');
    console.log('Press Ctrl+C to stop');
    
    const check = () => {
      const health = this.checkHealth();
      
      if (health.healthy) {
        console.log(`✅ Cache healthy - ${this.formatSize(health.size)}`);
      } else {
        console.log('🚨 Cache issues detected:');
        health.issues.forEach(issue => console.log(`   • ${issue}`));
        
        if (health.size > this.maxCacheSize * 0.8) {
          console.log('⚠️  Cache approaching size limit - consider clearing');
        }
      }
    };
    
    // Check immediately and then every 30 seconds
    check();
    const interval = setInterval(check, 30000);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      clearInterval(interval);
      console.log('\n👋 Cache monitoring stopped');
      process.exit(0);
    });
  }

  // Format bytes to readable size
  formatSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Get system info
  getSystemInfo() {
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;
    const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    
    return { nodeVersion, platform, arch, memory };
  }
}

// CLI Interface
const command = process.argv[2];
const monitor = new CacheMonitor();

switch (command) {
  case 'check':
    console.log('🔍 Checking cache health...');
    const health = monitor.checkHealth();
    
    if (health.healthy) {
      console.log(`✅ Cache is healthy - ${monitor.formatSize(health.size)}`);
    } else {
      console.log('❌ Cache issues found:');
      health.issues.forEach(issue => console.log(`   • ${issue}`));
      console.log('\n💡 Run: npm run cache:clear');
    }
    break;
    
  case 'clear':
    monitor.clearCache();
    break;
    
  case 'monitor':
    monitor.startMonitoring();
    break;
    
  case 'size':
    const size = monitor.getCacheSize();
    console.log(`📊 Cache size: ${monitor.formatSize(size)}`);
    
    if (size > monitor.maxCacheSize) {
      console.log('⚠️  Cache is too large - recommend clearing');
    }
    break;
    
  case 'info':
    const info = monitor.getSystemInfo();
    console.log('🖥️  System Info:');
    console.log(`   Node.js: ${info.nodeVersion}`);
    console.log(`   Platform: ${info.platform} ${info.arch}`);
    console.log(`   Memory: ${info.memory}MB`);
    
    const health2 = monitor.checkHealth();
    console.log(`   Cache: ${monitor.formatSize(health2.size)}`);
    break;
    
  default:
    console.log('🛠️  Cache Monitor Commands:');
    console.log('');
    console.log('  npm run cache:check    - Check cache health');
    console.log('  npm run cache:clear    - Clear cache safely');
    console.log('  npm run cache:monitor  - Monitor continuously');
    console.log('  npm run cache:size     - Show cache size');
    console.log('  npm run dev:clean      - Clean start development');
    console.log('');
    console.log('💡 Use npm run dev:clean for most stable development');
}