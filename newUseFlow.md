Refactor the application flow into a sequential 3-stage voice assessment experience.

Do NOT display all analysis metrics simultaneously.

Instead, guide the user through one focused analysis stage at a time.

---

# FLOW STRUCTURE

## Intro
- Display intro screen
- Show “분석 시작” button
- Request microphone permission after click
- Transition into Stage 1

---

## Stage 1 — Volume Analysis
Show Question 1.

Analyze:
- voice volume
- vocal energy
- speaking intensity

Visualization:
- segmented 4-level vertical bar system
- bars fill upward based on voice intensity

After analysis completes:
- transition to Stage 2

---

## Stage 2 — Pitch Analysis
Show Question 2.

Analyze:
- vocal pitch
- tonal variation
- emotional fluctuation

Visualization:
- vertical spatial motion system
- high pitch activates upper regions
- low pitch activates lower regions

After analysis completes:
- transition to Stage 3

---

## Stage 3 — Tempo Analysis
Show Question 3.

Analyze:
- speaking speed
- rhythm
- pause intervals
- speech tempo

Visualization:
- pulse propagation system
- rhythmic motion patterns
- timing-based animation behavior

After analysis completes:
- transition to Final Result

---

## Final Result
Combine:
- volume analysis
- pitch analysis
- tempo analysis

Generate:
- final personality type
- cinematic personality reveal
- dynamic environmental transformation

The experience should feel guided, immersive, and sequential rather than dashboard-based.