import { useRef, useState, useEffect, useCallback } from 'react';
import { AudioEngine } from './AudioEngine';
import { Visualizer } from './Visualizer';
import { PersonalityEngine } from './PersonalityEngine';
import './index.css';

const STAGE_SEC = 12;

const STAGES = [
  {
    key: 'stage1',
    num: 1,
    label: '볼륨 분석',
    metric: 'volume',
    question: '오늘 하루는 어땠나요?\n자유롭게 이야기해 보세요.',
    hint: '목소리의 크기와 에너지를 분석합니다',
  },
  {
    key: 'stage2',
    num: 2,
    label: '피치 분석',
    metric: 'pitch',
    question: '가장 좋아하는 것에\n대해 이야기해 보세요.',
    hint: '목소리의 높낮이와 감정 변화를 분석합니다',
  },
  {
    key: 'stage3',
    num: 3,
    label: '템포 분석',
    metric: 'tempo',
    question: '최근 가장 기억에 남는\n순간을 말해 보세요.',
    hint: '말하는 속도와 리듬을 분석합니다',
  },
];

const STAGE_KEYS = STAGES.map(s => s.key);

// ── MetricCard (unchanged) ────────────────────────────────────
function MetricCard({ label, value, color }) {
  const r = 27;
  const circ = 2 * Math.PI * r;
  const prog = ((value || 0) / 100) * circ;

  return (
    <div className="metric-card" style={{ '--c': color }}>
      <div className="metric-ring-wrap">
        <svg width="70" height="70" viewBox="0 0 70 70" className="metric-svg">
          <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
          <circle
            cx="35" cy="35" r={r}
            fill="none" stroke={color} strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${prog} ${circ}`}
            transform="rotate(-90 35 35)"
            style={{ filter: `drop-shadow(0 0 5px ${color})`, transition: 'stroke-dasharray 0.18s ease' }}
          />
        </svg>
        <div className="metric-val">{Math.round(value || 0)}</div>
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

function IdleAnim() {
  return (
    <div className="idle-anim">
      {[0.9, 1.4, 2.0, 1.5, 1.0, 1.6, 2.2, 1.3, 0.8, 1.7].map((h, i) => (
        <div key={i} className="idle-bar" style={{ '--h': h, animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const canvasRef    = useRef(null);
  const bgRef        = useRef(null);
  const audioRef     = useRef(null);
  const vizRef       = useRef(null);
  const persRef      = useRef(new PersonalityEngine());
  const rafRef       = useRef(null);
  const personalityRef = useRef(null);
  const stageStartRef  = useRef(null);
  const stageIdxRef    = useRef(0);
  const transitioning  = useRef(false);
  // 완료된 스테이지의 측정값 고정 보관
  const frozenRef = useRef({ volume: 50, pitch: 50, tempo: 50 });

  const [phase,      setPhase]      = useState('boot');
  const [stageIdx,   setStageIdx]   = useState(0);
  const [progress,   setProgress]   = useState(0);
  const [personality, setPersonality] = useState(null);
  const [metrics,    setMetrics]    = useState({ volume: 0, pitch: 50, tempo: 50 });

  // boot → intro
  useEffect(() => {
    const t = setTimeout(() => setPhase('intro'), 2000);
    return () => clearTimeout(t);
  }, []);

  // background
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const ctx = bg.getContext('2d');
    bg.width  = window.innerWidth;
    bg.height = window.innerHeight;
    ctx.fillStyle = personality?.bg?.[0] || '#050012';
    ctx.fillRect(0, 0, bg.width, bg.height);
  }, [personality?.bg?.[0]]);

  const startAnalysis = useCallback(async () => {
    try {
      const engine = new AudioEngine();
      await engine.start();
      audioRef.current  = engine;
      vizRef.current    = new Visualizer(canvasRef.current);
      persRef.current   = new PersonalityEngine();
      stageIdxRef.current  = 0;
      transitioning.current = false;
      stageStartRef.current = Date.now();

      setStageIdx(0);
      setProgress(0);
      setPhase('stage1');

      const loop = () => {
        if (!audioRef.current) return;

        const freq   = engine.getFrequencyData();
        const volume = engine.getVolume();
        const pitch  = engine.getPitch();
        const tempo  = engine.getTempo();

        // 현재 스테이지의 측정 대상만 라이브, 나머지는 고정값 사용
        const curMetric = STAGES[stageIdxRef.current].metric;
        const liveVal   = { volume, pitch, tempo }[curMetric];

        const eff = {
          ...frozenRef.current,
          [curMetric]: liveVal,   // 이번 스테이지만 실시간
        };

        const p = persRef.current.update(eff.volume, eff.pitch, eff.tempo);
        vizRef.current?.draw(freq, eff.volume, eff.pitch, eff.tempo, p);
        setMetrics(eff);
        setPersonality(p);

        // Stage timer
        const elapsed = Date.now() - stageStartRef.current;
        const prog    = Math.min(100, (elapsed / (STAGE_SEC * 1000)) * 100);
        setProgress(prog);

        if (prog >= 100 && !transitioning.current) {
          transitioning.current = true;

          // 마지막 측정값으로 고정
          frozenRef.current = { ...frozenRef.current, [curMetric]: liveVal };

          const nextIdx = stageIdxRef.current + 1;

          if (nextIdx >= STAGES.length) {
            engine.stop();
            audioRef.current = null;
            // 결과 화면용 마지막 프레임 — 0.7 스케일
            const f = frozenRef.current;
            vizRef.current?.draw(null, f.volume * 0.7, f.pitch, f.tempo, p);
            setPhase('result');
            return;
          }

          stageIdxRef.current   = nextIdx;
          stageStartRef.current = Date.now();
          transitioning.current = false;
          setStageIdx(nextIdx);
          setProgress(0);
          setPhase(STAGES[nextIdx].key);
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    } catch {
      alert('마이크 접근 권한이 필요합니다.');
    }
  }, []);

  const resetApp = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioRef.current?.stop();
    audioRef.current = null;
    vizRef.current?.destroy();
    vizRef.current = null;
    persRef.current = new PersonalityEngine();
    stageIdxRef.current   = 0;
    transitioning.current = false;
    frozenRef.current = { volume: 50, pitch: 50, tempo: 50 };
    setPersonality(null);
    setMetrics({ volume: 0, pitch: 50, tempo: 50 });
    setStageIdx(0);
    setProgress(0);
    setPhase('intro');
    const c = canvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  }, []);

  const isStage = STAGE_KEYS.includes(phase);
  const currentStage = STAGES[stageIdx] || STAGES[0];

  const p  = personality;
  const c0 = p?.colors?.[0] || '#00b4ff';
  const c1 = p?.colors?.[1] || '#7c3aed';
  const c2 = p?.colors?.[2] || '#00ffa3';

  // status badge label
  const badgeLabel = {
    boot: 'INIT', intro: 'READY',
    stage1: '1 / 3', stage2: '2 / 3', stage3: '3 / 3',
    result: 'DONE',
  }[phase] || 'READY';

  return (
    <div className="app">
      <canvas ref={bgRef} className="bg-canvas" />
      <div className="scan-line" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <svg className="logo-hex" viewBox="0 0 32 32" width="32" height="32">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9"
              fill="none" stroke={c0} strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 5px ${c0})` }} />
            <circle cx="16" cy="16" r="4" fill={c0}
              style={{ filter: `drop-shadow(0 0 6px ${c0})` }} />
          </svg>
          <span className="logo-text">VOICE<span style={{ color: c0 }}>OS</span></span>
        </div>
        <div className="header-right">
          {isStage && <span className="rec-dot" style={{ background: c0, boxShadow: `0 0 8px ${c0}` }} />}
          <span className="status-badge">{badgeLabel}</span>
        </div>
      </header>

      {/* Visualizer */}
      <main className="main">
        <canvas ref={canvasRef} className="viz-canvas" />

        {/* Boot */}
        {phase === 'boot' && (
          <div className="overlay">
            <div className="boot-hex">◈</div>
            <div className="boot-title">VOICE OS</div>
            <div className="boot-bar-wrap"><div className="boot-bar" /></div>
            <div className="boot-sub">AI 음성 성격 분석 시스템 초기화 중...</div>
          </div>
        )}

        {/* Intro */}
        {phase === 'intro' && (
          <div className="overlay">
            <IdleAnim />
            <h1 className="idle-title">VOICE PERSONALITY</h1>
            <p className="idle-sub">AI 음성 성격 분석 시스템</p>
            <ul className="idle-list">
              {['볼륨 · 피치 · 템포 순서로 단계별 분석', '9가지 성격 유형 분류', '다이나믹 시각화 생성'].map((f, i) => (
                <li key={i} style={{ animationDelay: `${0.3 + i * 0.2}s` }}>◆ {f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stage UI — question + progress (위/아래 패널만, 시각화 유지) */}
        {isStage && (
          <div className="stage-ui">
            <div className="stage-top-panel">
              <div className="stage-num-label" style={{ color: c0 }}>
                STAGE {currentStage.num} / 3 &nbsp;—&nbsp; {currentStage.label}
              </div>
              <div className="stage-question">
                {currentStage.question.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </div>
              <div className="stage-hint">{currentStage.hint}</div>
            </div>

            <div className="stage-progress-wrap">
              <div
                className="stage-progress-bar"
                style={{ width: `${progress}%`, background: c0, boxShadow: `0 0 8px ${c0}` }}
              />
            </div>
          </div>
        )}

        {/* Result — circular mask over wave */}
        {phase === 'result' && p && (
          <div className="overlay result-ov">
            {/* 원형 링 장식 */}
            <div className="res-circle-ring" />

            {/* 원 아래 텍스트 */}
            <div className="res-content">
              <div className="res-label" style={{ color: c0 }}>YOUR PERSONALITY TYPE</div>
              <div className="res-badge" style={{ borderColor: c0, boxShadow: `0 0 30px ${c0}44` }}>
                <span style={{ color: c0 }}>TYPE</span>
                <strong>{p.type}</strong>
              </div>
              <div className="res-name" style={{ textShadow: `0 0 30px ${c0}` }}>{p.name}</div>
              <div className="res-eng">{p.desc}</div>
              <div className="res-traits">{p.traits}</div>
              <div className="res-colors">
                {p.colors.map((c, i) => (
                  <span key={i} style={{ background: c, boxShadow: `0 0 10px ${c}` }} className="res-dot" />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">

        {/* 현재 스테이지 메트릭 하나만 표시, 결과/인트로에선 3개 모두 */}
        <div className="metrics">
          {isStage ? (
            <MetricCard
              label={currentStage.label}
              value={metrics[currentStage.metric]}
              color={c0}
            />
          ) : (
            <>
              <MetricCard label="볼륨" value={metrics.volume} color={c0} />
              <MetricCard label="피치" value={metrics.pitch}  color={c1} />
              <MetricCard label="템포" value={metrics.tempo}  color={c2} />
            </>
          )}
        </div>

        <div className="controls">
          {phase === 'result' ? (
            <button className="btn btn-reset" onClick={resetApp}>↺ 다시 분석</button>
          ) : isStage ? (
            <div className="stage-timer-label" style={{ color: c0 }}>
              {Math.ceil(STAGE_SEC - (progress / 100) * STAGE_SEC)}s
            </div>
          ) : (
            <button
              className={`btn btn-start ${phase === 'intro' ? 'pulsing' : ''}`}
              onClick={startAnalysis}
              disabled={phase !== 'intro'}
            >
              ▶ 분석 시작
            </button>
          )}
          <div className="ctrl-hint">
            {isStage
              ? `다음 단계까지 ${currentStage.hint}`
              : phase === 'result'
              ? '분석이 완료되었습니다'
              : '버튼을 눌러 분석을 시작하세요'}
          </div>
        </div>

        <div className="pers-panel">
          {p ? (
            <>
              <div className="pp-type"  style={{ color: c0 }}>TYPE {p.type}</div>
              <div className="pp-name">{p.name}</div>
              <div className="pp-motion">{p.motion}</div>
              <div className="pp-dots">
                {p.colors.map((c, i) => (
                  <span key={i} className="pp-dot" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                ))}
              </div>
            </>
          ) : (
            <div className="pp-empty">◈<br />분석 대기 중</div>
          )}
        </div>
      </footer>
    </div>
  );
}
