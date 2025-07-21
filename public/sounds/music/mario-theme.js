// Generates a Mario-inspired 8-bit tune using Web Audio API
// This creates an original composition inspired by classic gaming music

function generateMarioInspiredTheme() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 16; // 16 seconds of music
  
  // Create a buffer for our generated audio
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);
  
  // 8-bit style melody notes (original composition)
  const melody = [
    659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, // Main theme
    523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 440, // Continuation
    392, 659, 784, 880, 0, 698, 784, 0, 659, 0, 523, 587, 494 // Bridge
  ];
  
  let noteIndex = 0;
  const noteLength = sampleRate * 0.3; // Each note is 0.3 seconds
  
  for (let i = 0; i < data.length; i++) {
    const currentNote = Math.floor(i / noteLength) % melody.length;
    const frequency = melody[currentNote];
    
    if (frequency > 0) {
      // Generate square wave for 8-bit sound
      const time = i / sampleRate;
      const wave = Math.sign(Math.sin(2 * Math.PI * frequency * time));
      
      // Add envelope
      const noteTime = (i % noteLength) / noteLength;
      const envelope = noteTime < 0.1 ? noteTime / 0.1 : 
                     noteTime > 0.8 ? (1 - noteTime) / 0.2 : 1;
      
      data[i] = wave * envelope * 0.3;
    } else {
      data[i] = 0; // Rest/silence
    }
  }
  
  return buffer;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateMarioInspiredTheme };
} else {
  window.generateMarioInspiredTheme = generateMarioInspiredTheme;
}