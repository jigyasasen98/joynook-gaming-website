/**
 * Procedural continuous ambient sound synthesizer using Web Audio API.
 * Provides realistic continuous rain, thunder rumbles, wind, campfire crackle, and stream sounds.
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private windNode: AudioNode | null = null;
  private windGain: GainNode | null = null;
  private campfireNode: AudioNode | null = null;
  private campfireGain: GainNode | null = null;
  private streamNode: AudioNode | null = null;
  private streamGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.isRunning) return;
    this.isRunning = true;

    // 1. Rain Synthesizer (Pink Noise + Lowpass + Highpass)
    const rainBufferSize = this.ctx.sampleRate * 2;
    const rainBuffer = this.ctx.createBuffer(1, rainBufferSize, this.ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < rainBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      rainData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "lowpass";
    rainFilter.frequency.value = 1800;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    rainSource.start();
    this.rainNode = rainSource;

    // 2. Wind Synthesizer (Brown noise with slow modulated bandpass)
    const windBufferSize = this.ctx.sampleRate * 2;
    const windBuffer = this.ctx.createBuffer(1, windBufferSize, this.ctx.sampleRate);
    const windData = windBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < windBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      windData[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = windData[i];
      windData[i] *= 3.5;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 450;
    windFilter.Q.value = 2.0;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    windSource.start();
    this.windNode = windSource;

    // 3. Campfire Crackle (Random impulses + gentle hiss)
    const fireBufferSize = this.ctx.sampleRate * 2;
    const fireBuffer = this.ctx.createBuffer(1, fireBufferSize, this.ctx.sampleRate);
    const fireData = fireBuffer.getChannelData(0);
    for (let i = 0; i < fireBufferSize; i++) {
      if (Math.random() < 0.003) {
        fireData[i] = (Math.random() * 2 - 1) * 0.9;
      } else {
        fireData[i] = (Math.random() * 2 - 1) * 0.03;
      }
    }

    const fireSource = this.ctx.createBufferSource();
    fireSource.buffer = fireBuffer;
    fireSource.loop = true;

    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = "highpass";
    fireFilter.frequency.value = 1000;

    this.campfireGain = this.ctx.createGain();
    this.campfireGain.gain.setValueAtTime(0, this.ctx.currentTime);

    fireSource.connect(fireFilter);
    fireFilter.connect(this.campfireGain);
    this.campfireGain.connect(this.masterGain);
    fireSource.start();
    this.campfireNode = fireSource;
  }

  public setRainVolume(vol: number) {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setWindVolume(vol: number) {
    if (this.windGain && this.ctx) {
      this.windGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setCampfireVolume(vol: number) {
    if (this.campfireGain && this.ctx) {
      this.campfireGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  /**
   * Trigger a realistic procedural distant thunder rumble
   */
  public triggerThunder() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const thunderLen = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, thunderLen, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < thunderLen; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.03 * white) / 1.03;
      last = data[i];
      const envelope = Math.sin((i / thunderLen) * Math.PI) * Math.exp(-i / (this.ctx.sampleRate * 1.5));
      data[i] *= envelope * 5.0;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
  }

  public stop() {
    if (this.rainNode) {
      try { (this.rainNode as AudioBufferSourceNode).stop(); } catch {}
      this.rainNode = null;
    }
    if (this.windNode) {
      try { (this.windNode as AudioBufferSourceNode).stop(); } catch {}
      this.windNode = null;
    }
    if (this.campfireNode) {
      try { (this.campfireNode as AudioBufferSourceNode).stop(); } catch {}
      this.campfireNode = null;
    }
    this.isRunning = false;
  }
}

export const ambientSynth = new AmbientSynth();
