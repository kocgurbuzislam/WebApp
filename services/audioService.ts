
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const playTick = (counter: number = 0) => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  // Woodblock-like sound with alternating pitch (Tick-Tock)
  const isTick = counter % 2 === 0;
  const freq = isTick ? 800 : 600; // High for even, Lower for odd
  
  osc.frequency.setValueAtTime(freq, t);
  osc.type = 'triangle'; 
  
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  
  osc.start(t);
  osc.stop(t + 0.1);
};

export const playCorrect = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  // Play a major chord arpeggio (C - E - G - C)
  const notes = [523.25, 659.25, 783.99, 1046.50];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const startTime = t + (i * 0.1);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
    
    osc.start(startTime);
    osc.stop(startTime + 0.8);
  });
};

export const playWrong = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  // Dramatic "Fail" sound (Dissonant Sawtooth + Triangle slide)
  osc1.type = 'sawtooth';
  osc2.type = 'triangle';
  
  // Start low and dissonant
  osc1.frequency.setValueAtTime(150, t);
  osc2.frequency.setValueAtTime(105, t); // Dissonance (Tritone-ish)

  // Slide down significantly
  osc1.frequency.linearRampToValueAtTime(50, t + 1.0);
  osc2.frequency.linearRampToValueAtTime(40, t + 1.0);

  // Volume Envelope
  gain.gain.setValueAtTime(0.3, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.5); // Sustain briefly
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
  
  osc1.start(t);
  osc1.stop(t + 1.2);
  osc2.start(t);
  osc2.stop(t + 1.2);
};

export const playTimeout = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(100, t);
  osc.frequency.linearRampToValueAtTime(50, t + 0.8);
  
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.linearRampToValueAtTime(0.001, t + 0.8);
  
  osc.start(t);
  osc.stop(t + 0.8);
};

export const playPhoneRing = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Simulate a classic phone trill
  // Carrier frequency ~400Hz + ~450Hz
  // Modulated by ~20Hz
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  const masterGain = ctx.createGain();

  // Carrier 1
  osc1.type = 'sine';
  osc1.frequency.value = 400;

  // Carrier 2
  osc2.type = 'sine';
  osc2.frequency.value = 450;

  // Modulator (Ringing speed)
  mod.type = 'square';
  mod.frequency.value = 16; // Fast flutter

  // Connections
  mod.connect(modGain);
  modGain.connect(masterGain.gain); // Tremolo effect

  osc1.connect(masterGain);
  osc2.connect(masterGain);
  masterGain.connect(ctx.destination);

  // Envelope for the ring pattern (Ring... Ring...)
  // We'll play one long ring (2s)
  masterGain.gain.setValueAtTime(0, t);
  masterGain.gain.linearRampToValueAtTime(0.3, t + 0.1);
  masterGain.gain.setValueAtTime(0.3, t + 2.0);
  masterGain.gain.linearRampToValueAtTime(0, t + 2.1);

  // Start oscillators
  osc1.start(t);
  osc2.start(t);
  mod.start(t);

  // Stop everything after the ring duration
  const stopTime = t + 2.5;
  osc1.stop(stopTime);
  osc2.stop(stopTime);
  mod.stop(stopTime);
};
