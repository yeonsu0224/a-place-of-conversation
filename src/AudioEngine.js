export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.stream = null;
    this.bufferLength = 0;
    this.frequencyData = null;
    this.timeData = null;
    this._isSpeaking = false;
    this._lastSpeechTime = 0;
    this._speechIntervals = [];
    this._tempoSmooth = 50;
    this._volumeSmooth = 0;
    this._pitchSmooth = 50;
  }

  async start() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.75;

    this.source.connect(this.analyser);

    this.bufferLength = this.analyser.frequencyBinCount;
    this.frequencyData = new Uint8Array(this.bufferLength);
    this.timeData = new Float32Array(this.analyser.fftSize);
  }

  stop() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.audioContext) this.audioContext.close();
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
  }

  getFrequencyData() {
    if (!this.analyser) return this.frequencyData;
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getVolume() {
    if (!this.analyser || !this.frequencyData) return 0;
    const sum = this.frequencyData.reduce((a, b) => a + b, 0);
    const raw = Math.min(100, (sum / this.bufferLength / 128) * 100 * 2.5);
    this._volumeSmooth += (raw - this._volumeSmooth) * 0.15;
    return this._volumeSmooth;
  }

  getPitch() {
    if (!this.analyser || !this.audioContext) return this._pitchSmooth;
    this.analyser.getFloatTimeDomainData(this.timeData);
    const freq = this._autocorrelate(this.timeData, this.audioContext.sampleRate);
    if (freq < 0) return this._pitchSmooth;
    const normalized = Math.max(0, Math.min(100, ((freq - 80) / (900 - 80)) * 100));
    this._pitchSmooth += (normalized - this._pitchSmooth) * 0.08;
    return this._pitchSmooth;
  }

  getTempo() {
    if (!this.frequencyData) return this._tempoSmooth;
    const avg = this.frequencyData.reduce((a, b) => a + b, 0) / this.bufferLength;
    const vol = (avg / 128) * 100 * 2;
    const now = Date.now();
    const threshold = 18;

    if (vol > threshold && !this._isSpeaking) {
      this._isSpeaking = true;
      if (this._lastSpeechTime > 0) {
        const interval = now - this._lastSpeechTime;
        if (interval < 3000) {
          this._speechIntervals.push(interval);
          if (this._speechIntervals.length > 10) this._speechIntervals.shift();
        }
      }
      this._lastSpeechTime = now;
    } else if (vol < threshold * 0.6) {
      this._isSpeaking = false;
    }

    if (this._speechIntervals.length < 2) return this._tempoSmooth;
    const avgInterval = this._speechIntervals.reduce((a, b) => a + b, 0) / this._speechIntervals.length;
    const tempo = Math.max(0, Math.min(100, 100 - ((avgInterval - 100) / (1900)) * 100));
    this._tempoSmooth += (tempo - this._tempoSmooth) * 0.05;
    return this._tempoSmooth;
  }

  _autocorrelate(buf, sampleRate) {
    const SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    const buf2 = buf.slice(r1, r2);
    const len = buf2.length;
    const c = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i; j++) c[i] += buf2[j] * buf2[j + i];
    }

    let d = 0;
    while (d < len - 1 && c[d] > c[d + 1]) d++;
    let maxVal = -1, maxPos = -1;
    for (let i = d; i < len; i++) {
      if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
    }
    if (maxPos < 1 || maxPos >= len - 1) return -1;

    const x1 = c[maxPos - 1], x2 = c[maxPos], x3 = c[maxPos + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    let T0 = maxPos;
    if (a) T0 = maxPos - b / (2 * a);
    return sampleRate / T0;
  }
}
