/**
 * Procedural audio engine using Web Audio API.
 * No external sound files — generates foley, UI, and ambient tones in-browser.
 */

type SoundName =
  | "paperRustle"
  | "paperSnap"
  | "ledgerClick"
  | "chaChing"
  | "sortTick"
  | "balanceThud"
  | "successChime"
  | "navClick"
  | "whoosh";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOscillators: OscillatorNode[] = [];
let ambientTimers: ReturnType<typeof setInterval>[] = [];
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.35;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

export function resumeAudio(): void {
  const c = getContext();
  if (c?.state === "suspended") void c.resume();
}

export function setAudioMuted(value: boolean): void {
  muted = value;
  if (masterGain) masterGain.gain.value = value ? 0 : 0.35;
}

export function isAudioMuted(): boolean {
  return muted;
}

function playNoiseBurst(duration: number, volume: number, filterFreq = 800): void {
  const c = getContext();
  if (!c || !masterGain) return;

  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();
}

function playTone(
  freq: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  attack = 0.01,
): void {
  const c = getContext();
  if (!c || !masterGain) return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(c.currentTime + duration + 0.05);
}

function playChaChing(): void {
  playTone(1200, 0.15, 0.12, "triangle");
  setTimeout(() => playTone(1800, 0.25, 0.1, "sine"), 60);
  setTimeout(() => playTone(2400, 0.3, 0.06, "sine"), 120);
}

function playSuccessChime(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 0.08, "sine", 0.02), i * 100);
  });
}

export function playSound(name: SoundName, volume = 1): void {
  resumeAudio();
  const v = volume;

  switch (name) {
    case "paperRustle":
      playNoiseBurst(0.12, 0.06 * v, 600);
      break;
    case "paperSnap":
      playNoiseBurst(0.04, 0.1 * v, 2000);
      playTone(180, 0.08, 0.04 * v, "square");
      break;
    case "ledgerClick":
      playTone(800, 0.05, 0.06 * v, "square");
      break;
    case "chaChing":
      playChaChing();
      break;
    case "sortTick":
      playTone(600 + Math.random() * 200, 0.04, 0.05 * v, "triangle");
      break;
    case "balanceThud":
      playTone(120, 0.2, 0.1 * v, "sine");
      playNoiseBurst(0.06, 0.04 * v, 300);
      break;
    case "successChime":
      playSuccessChime();
      break;
    case "navClick":
      playTone(900, 0.06, 0.05 * v, "triangle");
      break;
    case "whoosh":
      playNoiseBurst(0.25, 0.04 * v, 400);
      break;
  }
}

/** Layered ambient fintech score for the opening sequence. */
export function startAmbientMusic(): void {
  const c = getContext();
  if (!c || !masterGain || ambientOscillators.length > 0) return;

  const freqs = [110, 164.81, 220, 277.18, 329.63];
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.value = i < 2 ? 0.018 : 0.01;
    osc.connect(gain);
    gain.connect(masterGain!);
    osc.start();
    ambientOscillators.push(osc);
  });

  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.008;
  lfo.connect(lfoGain);
  if (ambientOscillators[0]) {
    lfoGain.connect(ambientOscillators[0].frequency);
  }
  lfo.start();
  ambientOscillators.push(lfo);

  const melody = [440, 523.25, 659.25, 523.25, 392, 440, 554.37, 659.25];
  let note = 0;
  ambientTimers.push(
    setInterval(() => {
      playTone(melody[note % melody.length], 0.7, 0.027, "triangle", 0.08);
      if (note % 4 === 0) {
        playTone(note % 8 === 0 ? 110 : 130.81, 1.2, 0.025, "sine", 0.12);
      }
      note += 1;
    }, 620),
  );
}

export function stopAmbientMusic(): void {
  ambientOscillators.forEach((osc) => {
    try {
      osc.stop();
    } catch {
      /* already stopped */
    }
  });
  ambientOscillators = [];
  ambientTimers.forEach(clearInterval);
  ambientTimers = [];
}

export function scheduleIntroSounds(onPhase: (phase: number) => void): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];

  const schedule = (ms: number, fn: () => void) => {
    timers.push(setTimeout(fn, ms));
  };

  // Ambient music starts only after a user gesture (OpeningAnimation.activateSound).
  schedule(350, () => playSound("paperRustle", 0.55));
  schedule(800, () => playSound("paperRustle", 0.45));
  schedule(1200, () => {
    playSound("whoosh", 0.8);
    onPhase(1);
  });
  schedule(1700, () => playSound("ledgerClick", 0.8));
  schedule(2900, () => {
    playSound("paperSnap", 0.8);
    onPhase(2);
  });
  for (let index = 0; index < 12; index += 1) {
    schedule(3150 + index * 270, () => {
      playSound(index % 3 === 0 ? "paperSnap" : "sortTick", 0.55);
    });
  }
  schedule(6500, () => {
    playSound("balanceThud", 0.75);
    onPhase(3);
  });
  schedule(7300, () => {
    playSound("ledgerClick", 0.9);
    onPhase(4);
  });
  schedule(8500, () => {
    playSound("successChime", 0.7);
    onPhase(5);
  });

  return () => {
    // Clear pending foley only — OpeningAnimation owns ambient music lifecycle.
    timers.forEach(clearTimeout);
  };
}
