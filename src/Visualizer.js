// 4 stacked layers, each with its own sine wave + masked bars
const BAR_COUNT = 70; // 모든 레이어 공통 — 중심 x 정렬

const LAYERS = [
  // bottom → top  (barRatio만 달라짐 → 같은 중심, 다른 두께)
  { freqBandStart: 0.00, freqBandEnd: 0.20, speedMult: 1.0, freqMult: 1.2, phase: 0.0, barRatio: 0.58 },
  { freqBandStart: 0.20, freqBandEnd: 0.45, speedMult: 1.6, freqMult: 2.0, phase: 1.1, barRatio: 0.42 },
  { freqBandStart: 0.45, freqBandEnd: 0.72, speedMult: 2.3, freqMult: 2.9, phase: 2.4, barRatio: 0.28 },
  { freqBandStart: 0.72, freqBandEnd: 1.00, speedMult: 3.1, freqMult: 3.8, phase: 3.7, barRatio: 0.16 },
];

// Vertical zone boundaries (canvas-height ratio), bottom layer first
const ZONES = [
  { bot: 1.00, top: 0.60 },
  { bot: 0.60, top: 0.38 },
  { bot: 0.38, top: 0.22 },
  { bot: 0.22, top: 0.07 },
];

export class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._time = 0;
    this._color = '#00b4ff';
    // per-layer smoothed amplitude
    this._amps = new Float32Array(4);
    this._resize();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(canvas);
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;
    if (!w || !h) return;
    this.canvas.width  = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // composite sine wave y-value
  _wy(xNorm, t, amp, freq, cy) {
    return (
      cy +
      Math.sin(xNorm * Math.PI * 2 * freq + t)         * amp +
      Math.sin(xNorm * Math.PI * 2 * freq * 0.5 + t * 1.3) * amp * 0.35 +
      Math.sin(xNorm * Math.PI * 2 * freq * 1.7 + t * 0.7) * amp * 0.15
    );
  }

  draw(frequencyData, volume, pitch, tempo, personality) {
    const ctx = this.ctx;
    const w   = this.canvas.offsetWidth;
    const h   = this.canvas.offsetHeight;
    if (!w || !h) return;

    if (personality?.colors?.[0]) this._color = personality.colors[0];

    this._time += 0.016;

    const volF   = Math.min(1, (volume || 0) / 100);
    const pitchF = (pitch  || 50) / 100;
    const tempoF = (tempo  || 50) / 100;

    ctx.clearRect(0, 0, w, h);

    LAYERS.forEach((layer, idx) => {
      const zone = ZONES[idx];
      const zoneBot = zone.bot * h;
      const zoneTop = zone.top * h;
      const zoneH   = zoneBot - zoneTop;

      // 맨 위 레이어는 진폭 0 → 직선 고정
      const targetAmp = idx === LAYERS.length - 1
        ? 0
        : h * 0.06 + volF * h * 0.50;
      if (targetAmp > this._amps[idx]) {
        this._amps[idx] += (targetAmp - this._amps[idx]) * 0.25;
      } else {
        this._amps[idx] += (targetAmp - this._amps[idx]) * 0.06;
      }
      const amp = this._amps[idx];

      const freq  = layer.freqMult + pitchF * 1.4;
      const speed = layer.speedMult * (0.012 + tempoF * 0.022);
      const t     = this._time * speed / 0.016 + layer.phase;
      // 마지막 레이어: y=0(화면 최상단) 직선, 아래는 zoneBot까지만
      const isTop     = idx === LAYERS.length - 1;
      const cy        = isTop ? 0 : zoneTop + zoneH * 0.28;
      const clipBottom = h;

      const pts = 220;

      // ── clip: area below wave ─────────────────────────────────
      ctx.save();
      ctx.beginPath();

      for (let i = 0; i <= pts; i++) {
        const xn = i / pts;
        const y  = Math.max(0, Math.min(clipBottom, this._wy(xn, t, amp, freq, cy)));
        if (i === 0) ctx.moveTo(xn * w, y);
        else         ctx.lineTo(xn * w, y);
      }
      ctx.lineTo(w, clipBottom);
      ctx.lineTo(0, clipBottom);
      ctx.closePath();
      ctx.clip();

      // ── bars inside clip ──────────────────────────────────────
      const { barRatio } = layer;
      const slotW  = w / BAR_COUNT;
      const barW   = slotW * barRatio;
      const dataStep = frequencyData
        ? Math.max(1, Math.floor(
            (layer.freqBandEnd - layer.freqBandStart) * frequencyData.length / BAR_COUNT
          ))
        : 1;
      const dataOffset = frequencyData
        ? Math.floor(layer.freqBandStart * frequencyData.length)
        : 0;

      ctx.fillStyle = this._color;

      for (let i = 0; i < BAR_COUNT; i++) {
        const xn   = (i + 0.5) / BAR_COUNT;
        const waveY = Math.max(0, Math.min(clipBottom, this._wy(xn, t, amp, freq, cy)));
        const barH  = clipBottom - waveY;
        if (barH < 1) continue;

        const bx = i * slotW + (slotW - barW) / 2;
        ctx.fillRect(bx, waveY, barW, barH);
      }

      ctx.restore();

    });
  }

  destroy() {
    if (this._ro) this._ro.disconnect();
  }
}
