export const PERSONALITIES = {
  A: {
    name: '열정적인 활동가',
    desc: 'Passionate Activist',
    traits: '높은 에너지 · 빠른 템포 · 강한 표현',
    colors: ['#ff2d55', '#ff006e', '#ff6b00'],
    bg: ['#1a000a', '#0d0015'],
    motion: 'explosive',
  },
  B: {
    name: '침착한 분석가',
    desc: 'Calm Analyst',
    traits: '안정적 음조 · 낮은 볼륨 · 규칙적 리듬',
    colors: ['#0a84ff', '#005eff', '#00c7ff'],
    bg: ['#00061a', '#000e2e'],
    motion: 'symmetric',
  },
  C: {
    name: '풍부한 표현가',
    desc: 'Rich Expresser',
    traits: '높은 피치 · 다채로운 감정 · 역동적 변화',
    colors: ['#bf5af2', '#ff2d55', '#ff69b4'],
    bg: ['#12002a', '#1a0020'],
    motion: 'chaotic',
  },
  D: {
    name: '신중한 전략가',
    desc: 'Careful Strategist',
    traits: '낮은 피치 · 느린 템포 · 절제된 표현',
    colors: ['#00e5ff', '#3949ab', '#1a237e'],
    bg: ['#000e15', '#00061a'],
    motion: 'deep',
  },
  E: {
    name: '외향적 리더',
    desc: 'Extroverted Leader',
    traits: '강한 목소리 · 빠른 템포 · 압도적 에너지',
    colors: ['#ff9f0a', '#ffd60a', '#ff6b00'],
    bg: ['#150a00', '#0d0500'],
    motion: 'radiant',
  },
  F: {
    name: '감성 공감자',
    desc: 'Empathetic Soul',
    traits: '부드러운 볼륨 · 따뜻한 음조 · 섬세한 리듬',
    colors: ['#ff85a1', '#ffb347', '#ffcdd2'],
    bg: ['#150008', '#1a0010'],
    motion: 'waves',
  },
  G: {
    name: '창의적 탐험가',
    desc: 'Creative Explorer',
    traits: '불규칙 음조 · 실험적 패턴 · 자유로운 표현',
    colors: ['#00b4ff', '#7c3aed', '#e040fb'],
    bg: ['#000015', '#07001a'],
    motion: 'unpredictable',
  },
  H: {
    name: '차분한 중재자',
    desc: 'Calm Mediator',
    traits: '균형 잡힌 음조 · 안정적 템포 · 조화로운 표현',
    colors: ['#00ffa3', '#00d4ff', '#4dd0e1'],
    bg: ['#001510', '#00101a'],
    motion: 'harmonious',
  },
  I: {
    name: '직관적 몽상가',
    desc: 'Intuitive Dreamer',
    traits: '공기 같은 음색 · 감성적 흔들림 · 몽환적 리듬',
    colors: ['#c39bd3', '#7b1fa2', '#b39ddb'],
    bg: ['#0d0015', '#07000d'],
    motion: 'floating',
  },
};

export class PersonalityEngine {
  constructor() {
    this._history = { volume: [], pitch: [], tempo: [] };
    this._currentType = 'H';
    this._typeSmooth = {};
    Object.keys(PERSONALITIES).forEach(k => (this._typeSmooth[k] = 0));
    this._typeSmooth.H = 1;
  }

  update(volume, pitch, tempo) {
    const h = this._history;
    h.volume.push(volume);
    h.pitch.push(pitch);
    h.tempo.push(tempo);
    if (h.volume.length > 90) { h.volume.shift(); h.pitch.shift(); h.tempo.shift(); }

    const avgVol = h.volume.reduce((a, b) => a + b, 0) / h.volume.length;
    const avgPitch = h.pitch.reduce((a, b) => a + b, 0) / h.pitch.length;
    const avgTempo = h.tempo.reduce((a, b) => a + b, 0) / h.tempo.length;
    const pitchVar = h.pitch.length > 10
      ? h.pitch.reduce((acc, p) => acc + Math.abs(p - avgPitch), 0) / h.pitch.length
      : 0;

    const scores = this._score(avgVol, avgPitch, avgTempo, pitchVar);

    // Smooth scores
    let maxKey = 'H', maxVal = -Infinity;
    for (const [k, s] of Object.entries(scores)) {
      this._typeSmooth[k] += (s - this._typeSmooth[k]) * 0.03;
      if (this._typeSmooth[k] > maxVal) { maxVal = this._typeSmooth[k]; maxKey = k; }
    }
    this._currentType = maxKey;
    return this.getCurrent();
  }

  _score(vol, pitch, tempo, pitchVar) {
    return {
      A: (vol > 65 ? 2 : vol > 45 ? 1 : 0) + (tempo > 65 ? 2 : tempo > 50 ? 1 : 0),
      B: (vol < 40 ? 2 : 0) + (pitchVar < 8 ? 2 : pitchVar < 15 ? 1 : 0) + (Math.abs(tempo - 50) < 20 ? 1 : 0),
      C: (pitch > 62 ? 2 : pitch > 52 ? 1 : 0) + (pitchVar > 18 ? 2 : pitchVar > 10 ? 1 : 0),
      D: (pitch < 38 ? 2 : pitch < 48 ? 1 : 0) + (tempo < 35 ? 2 : tempo < 45 ? 1 : 0),
      E: (vol > 60 ? 2 : 0) + (tempo > 55 ? 1 : 0) + (pitchVar < 20 ? 1 : 0),
      F: (vol < 45 ? 1 : 0) + (pitch > 45 && pitch < 65 ? 2 : 0) + (pitchVar > 8 && pitchVar < 20 ? 1 : 0),
      G: (pitchVar > 22 ? 3 : pitchVar > 15 ? 1.5 : 0) + (vol > 25 ? 0.5 : 0),
      H: (Math.abs(pitch - 50) < 15 ? 1.5 : 0) + (Math.abs(tempo - 50) < 20 ? 1.5 : 0) + (vol > 25 && vol < 70 ? 1 : 0),
      I: (vol < 42 ? 1 : 0) + (pitchVar > 8 && pitchVar < 22 ? 1 : 0) + (tempo < 48 ? 1.5 : 0),
    };
  }

  getCurrent() {
    return { type: this._currentType, ...PERSONALITIES[this._currentType] };
  }
}
