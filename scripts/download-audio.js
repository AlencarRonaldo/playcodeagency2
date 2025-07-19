#!/usr/bin/env node

/**
 * Audio Download Script - PlayCode Agency
 * Downloads free gaming audio files from recommended sources
 */

const fs = require('fs')
const https = require('https')
const path = require('path')

// Recommended free audio sources
const AUDIO_SOURCES = {
  // UI Sounds - Free from Mixkit
  ui: [
    {
      name: 'click-primary',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/2997/2997.wav', // Button click
        'https://cdn.pixabay.com/download/audio/2022/03/10/audio_d1108ab07b.mp3'
      ],
      description: 'Cyberpunk button click primary'
    },
    {
      name: 'click-secondary', 
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/2998/2998.wav', // Soft click
        'https://cdn.pixabay.com/download/audio/2021/08/09/audio_12b0c7443c.mp3'
      ],
      description: 'Secondary interface click'
    },
    {
      name: 'hover-soft',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/2999/2999.wav', // Hover sound
        'https://cdn.pixabay.com/download/audio/2022/03/15/audio_e1a7b4d67e.mp3'
      ],
      description: 'Holographic hover effect'
    },
    {
      name: 'navigation',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3000/3000.wav', // Navigation
        'https://cdn.pixabay.com/download/audio/2021/12/06/audio_5e2b4b8c8f.mp3'
      ],
      description: 'Interface navigation sound'
    }
  ],

  // Achievement sounds
  achievements: [
    {
      name: 'unlock-common',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3001/3001.wav', // Achievement
        'https://cdn.pixabay.com/download/audio/2022/03/22/audio_a1f2e3c4d5.mp3'
      ],
      description: 'Data fragment unlocked'
    },
    {
      name: 'unlock-rare',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3002/3002.wav', // Power-up
        'https://cdn.pixabay.com/download/audio/2022/04/10/audio_b2f3e4c5d6.mp3'
      ],
      description: 'Neural link established'
    },
    {
      name: 'unlock-epic',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3003/3003.wav', // Epic achievement
        'https://cdn.pixabay.com/download/audio/2022/05/15/audio_c3f4e5c6d7.mp3'
      ],
      description: 'Cybernet breach'
    },
    {
      name: 'unlock-legendary',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3004/3004.wav', // Legendary
        'https://cdn.pixabay.com/download/audio/2022/06/20/audio_d4f5e6c7d8.mp3'
      ],
      description: 'Matrix override'
    }
  ],

  // Gaming sounds
  gaming: [
    {
      name: 'powerup-select',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3005/3005.wav', // Power-up select
        'https://cdn.pixabay.com/download/audio/2022/07/25/audio_e5f6e7c8d9.mp3'
      ],
      description: 'Neural implant activated'
    },
    {
      name: 'level-up',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3006/3006.wav', // Level up
        'https://cdn.pixabay.com/download/audio/2022/08/30/audio_f6f7e8c9da.mp3'
      ],
      description: 'System upgrade complete'
    },
    {
      name: 'xp-gain',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3007/3007.wav', // XP gain
        'https://cdn.pixabay.com/download/audio/2022/09/05/audio_g7f8e9cadb.mp3'
      ],
      description: 'Data absorption'
    },
    {
      name: 'konami-sequence',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3008/3008.wav', // Konami
        'https://cdn.pixabay.com/download/audio/2022/10/10/audio_h8f9eadbec.mp3'
      ],
      description: 'Cheat code activated'
    }
  ],

  // System sounds
  system: [
    {
      name: 'boot-complete',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3009/3009.wav', // Boot complete
        'https://cdn.pixabay.com/download/audio/2022/11/15/audio_i9faebdced.mp3'
      ],
      description: 'Neural network online'
    },
    {
      name: 'error',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3010/3010.wav', // Error
        'https://cdn.pixabay.com/download/audio/2022/12/20/audio_jafbecdefe.mp3'
      ],
      description: 'System malfunction'
    },
    {
      name: 'notification',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3011/3011.wav', // Notification
        'https://cdn.pixabay.com/download/audio/2023/01/25/audio_kbfcede0f1.mp3'
      ],
      description: 'Incoming data'
    },
    {
      name: 'chatbot-beep',
      urls: [
        'https://assets.mixkit.co/active_storage/sfx/3012/3012.wav', // Chatbot
        'https://cdn.pixabay.com/download/audio/2023/02/28/audio_lcfdefe1f2.mp3'
      ],
      description: 'AI communication'
    }
  ],

  // Background music (shorter clips for demo)
  music: [
    {
      name: 'cyberpunk-ambient',
      urls: [
        'https://cdn.pixabay.com/download/audio/2023/03/05/audio_md0e0f1f23.mp3', // Cyberpunk ambient
        'https://assets.mixkit.co/active_storage/sfx/3013/3013.mp3'
      ],
      description: 'Cyberpunk ambient atmosphere'
    },
    {
      name: 'cyberpunk-intense',
      urls: [
        'https://cdn.pixabay.com/download/audio/2023/04/10/audio_ne1f1f2034.mp3', // Intense cyberpunk
        'https://assets.mixkit.co/active_storage/sfx/3014/3014.mp3'
      ],
      description: 'High-energy cyberpunk'
    },
    {
      name: 'cyberpunk-chill',
      urls: [
        'https://cdn.pixabay.com/download/audio/2023/05/15/audio_of2f2f3145.mp3', // Chill cyberpunk
        'https://assets.mixkit.co/active_storage/sfx/3015/3015.mp3'
      ],
      description: 'Relaxed cyberpunk atmosphere'
    }
  ]
}

// Create directories
function ensureDirectories() {
  const dirs = [
    'public/sounds/sfx/ui',
    'public/sounds/sfx/achievements', 
    'public/sounds/sfx/gaming',
    'public/sounds/sfx/system',
    'public/sounds/music'
  ]

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
    }
  })
}

// Download file with retry
async function downloadFile(url, filePath, retries = 3) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(filePath)
        })
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadFile(response.headers.location, filePath, retries)
          .then(resolve)
          .catch(reject)
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    })

    request.on('error', (err) => {
      fs.unlink(filePath, () => {}) // Delete partial file
      if (retries > 0) {
        console.log(`⚠️ Retrying download: ${url} (${retries} attempts left)`)
        setTimeout(() => {
          downloadFile(url, filePath, retries - 1)
            .then(resolve)
            .catch(reject)
        }, 1000)
      } else {
        reject(err)
      }
    })

    file.on('error', (err) => {
      fs.unlink(filePath, () => {})
      reject(err)
    })
  })
}

// Convert audio format using ffmpeg (if available)
async function convertToOgg(inputPath, outputPath) {
  const { exec } = require('child_process')
  
  return new Promise((resolve) => {
    exec(`ffmpeg -i "${inputPath}" -acodec libvorbis -aq 5 "${outputPath}"`, (error) => {
      if (error) {
        console.log(`⚠️ ffmpeg not available, keeping original format for ${path.basename(inputPath)}`)
        resolve(false)
      } else {
        console.log(`✅ Converted to OGG: ${path.basename(outputPath)}`)
        resolve(true)
      }
    })
  })
}

// Main download function
async function downloadAllAudio() {
  console.log('🎵 Starting PlayCode Agency audio download...\n')
  
  ensureDirectories()
  
  let totalFiles = 0
  let successfulDownloads = 0

  for (const [category, sounds] of Object.entries(AUDIO_SOURCES)) {
    console.log(`\n📂 Downloading ${category} sounds...`)
    
    for (const sound of sounds) {
      totalFiles++
      
      const extension = sound.urls[0].includes('.wav') ? '.wav' : '.mp3'
      const fileName = `${sound.name}${extension}`
      const filePath = path.join('public', 'sounds', 'sfx', category, fileName)
      const musicPath = path.join('public', 'sounds', 'music', fileName)
      
      const targetPath = category === 'music' ? musicPath : filePath
      
      console.log(`  📥 ${sound.description}...`)
      
      // Try each URL until one works
      let downloaded = false
      for (const url of sound.urls) {
        try {
          await downloadFile(url, targetPath)
          console.log(`    ✅ Downloaded: ${fileName}`)
          
          // Try to convert to OGG for better web compatibility
          if (extension !== '.ogg') {
            const oggPath = targetPath.replace(extension, '.ogg')
            await convertToOgg(targetPath, oggPath)
          }
          
          successfulDownloads++
          downloaded = true
          break
        } catch (error) {
          console.log(`    ❌ Failed: ${url} (${error.message})`)
        }
      }
      
      if (!downloaded) {
        console.log(`    ⚠️ All sources failed for: ${sound.name}`)
      }
    }
  }

  console.log(`\n🎯 Download Summary:`)
  console.log(`   Successfully downloaded: ${successfulDownloads}/${totalFiles} files`)
  
  if (successfulDownloads < totalFiles) {
    console.log(`\n💡 Some files failed to download. You can:`)
    console.log(`   1. Manually search for free sounds at:`)
    console.log(`      - freesound.org`)
    console.log(`      - mixkit.co`)
    console.log(`      - pixabay.com/music`)
    console.log(`   2. Use temporary placeholder sounds for development`)
  }
  
  console.log(`\n🎮 Audio system ready! Start the dev server to test.`)
}

// Create placeholder files if download fails
function createPlaceholderFiles() {
  console.log('📁 Creating placeholder audio files for development...')
  
  const categories = Object.keys(AUDIO_SOURCES)
  
  categories.forEach(category => {
    AUDIO_SOURCES[category].forEach(sound => {
      const dir = category === 'music' ? 'music' : `sfx/${category}`
      const oggPath = path.join('public', 'sounds', dir, `${sound.name}.ogg`)
      const mp3Path = path.join('public', 'sounds', dir, `${sound.name}.mp3`)
      
      // Create empty files as placeholders
      if (!fs.existsSync(oggPath)) {
        fs.writeFileSync(oggPath, '')
        console.log(`📄 Created placeholder: ${oggPath}`)
      }
      
      if (!fs.existsSync(mp3Path)) {
        fs.writeFileSync(mp3Path, '')
        console.log(`📄 Created placeholder: ${mp3Path}`)
      }
    })
  })
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--placeholder')) {
    createPlaceholderFiles()
  } else {
    downloadAllAudio().catch(error => {
      console.error('❌ Download failed:', error)
      console.log('\n📁 Creating placeholder files instead...')
      createPlaceholderFiles()
    })
  }
}

module.exports = { downloadAllAudio, createPlaceholderFiles }