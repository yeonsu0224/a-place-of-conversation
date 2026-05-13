# PROJECT SPEC
## Real-Time Voice Personality Analysis Platform

---

# ROLE

You are a senior creative frontend engineer, motion designer, and audio visualization specialist.

Your task is to build a premium futuristic AI-powered voice analysis platform with cinematic-quality UI/UX.

This is NOT a typical dashboard project.

The final result should feel like:
- a futuristic AI operating system
- an immersive audiovisual experience
- a premium cyberpunk voice analyzer
- a cinematic interactive media artwork

Prioritize:
- immersive visuals
- fluid motion
- emotional responsiveness
- premium UI quality
- clean architecture
- smooth animations
- responsive design

---

# PRODUCT VISION

Create a real-time voice analysis web application that analyzes a user's microphone input and transforms their voice characteristics into both:

1. Psychological personality archetypes
2. Dynamic audiovisual visualizations

The application should feel alive.

The visualizer should not simply display audio data.

Instead, the user's personality and emotional energy should appear to physically shape the visual environment in real time.

---

# CORE EXPERIENCE

The experience flow:

1. User opens app
2. Cinematic futuristic interface appears
3. User clicks “분석 시작”
4. Microphone permission requested
5. Real-time visualization activates
6. Voice metrics begin reacting
7. Personality engine analyzes voice patterns
8. Background, motion, and visuals evolve dynamically
9. User receives one of 9 personality archetypes

The experience should feel magical, emotional, and immersive.

---

# TECH STACK

Use:
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Web Audio API
- HTML5 Canvas

DO NOT use:
- external visualization libraries
- backend services
- heavy frameworks

Use pure Web Audio API.

---

# AUDIO ANALYSIS ENGINE

Analyze microphone input in real time.

Extract:
1. Volume
2. Pitch
3. Tempo

Normalize all metrics to 0~100.

---

## Volume Analysis

Measure:
- energy
- amplitude
- dB intensity

Higher volume should:
- increase visual intensity
- increase glow
- increase particle activity
- increase wave amplitude

---

## Pitch Analysis

Use autocorrelation-based pitch detection.

Measure:
- estimated frequency in Hz

High pitch should:
- activate upper frequency visual regions
- brighten colors
- create lighter/faster wave movement

Low pitch should:
- create heavier slower waves
- activate lower visual regions
- produce deeper motion

---

## Tempo Analysis

Estimate speech tempo by analyzing:
- speech activity frequency
- transient activity
- timing intervals

Fast tempo should:
- increase animation speed
- accelerate wave propagation
- create energetic motion

Slow tempo should:
- create calm smooth motion
- increase easing
- create longer transitions

---

# PERSONALITY ENGINE

Create a dynamic personality classification system using voice characteristics.

The classification system should continuously evolve in real time.

---

# 9 PERSONALITY TYPES

## Type A — 열정적인 활동가
Traits:
- high volume
- high tempo
- energetic
Visual Mood:
- red
- magenta
- explosive motion

---

## Type B — 침착한 분석가
Traits:
- stable pitch
- low volume
- consistent rhythm
Visual Mood:
- blue
- navy
- calm symmetrical motion

---

## Type C — 풍부한 표현가
Traits:
- high pitch
- dynamic tempo
- emotional variation
Visual Mood:
- purple
- pink
- chaotic flowing motion

---

## Type D — 신중한 전략가
Traits:
- low pitch
- slow tempo
- controlled speech
Visual Mood:
- dark cyan
- indigo
- deep slow waves

---

## Type E — 외향적 리더
Traits:
- dominant voice
- stable fast tempo
- powerful energy
Visual Mood:
- orange
- gold
- aggressive radiant movement

---

## Type F — 감성 공감자
Traits:
- soft volume
- warm pitch variation
- gentle rhythm
Visual Mood:
- soft pink
- peach
- smooth emotional waves

---

## Type G — 창의적 탐험가
Traits:
- irregular pitch movement
- experimental speech patterns
- highly dynamic expression
Visual Mood:
- electric blue
- violet
- unpredictable wave structures

---

## Type H — 차분한 중재자
Traits:
- balanced pitch
- stable tempo
- medium volume
Visual Mood:
- mint
- sky blue
- harmonious movement

---

## Type I — 직관적 몽상가
Traits:
- airy voice tone
- emotional fluctuations
- dreamy rhythm
Visual Mood:
- lavender
- deep purple
- floating atmospheric motion

---

# VISUALIZATION SYSTEM

THIS IS THE MOST IMPORTANT SECTION.

The center of the screen must contain a cinematic real-time audio visualizer.

DO NOT create:
- a generic equalizer
- a basic waveform
- a simple FFT graph

The visualizer must feel:
- alive
- emotional
- fluid
- futuristic
- cinematic
- organic

The style should resemble:
- Apple Music visualizers
- cyberpunk HUD interfaces
- futuristic AI systems
- holographic music analyzers

---

# VISUALIZER DESIGN

Create:
- hundreds of thin vertical bars
- flowing wave structures
- smooth interpolation
- neon gradients
- ambient glow
- trailing effects
- cinematic motion blur feeling

Bars should:
- react smoothly
- feel physically connected
- form flowing wave patterns

Use:
- analyser.getByteFrequencyData()
- requestAnimationFrame()
- canvas rendering

---

# IMPORTANT VISUAL RULE

The visualizer MUST NOT react only to volume.

Visualization behavior must dynamically respond to:
- volume
- pitch
- tempo
- personality classification state

Examples:

- High pitch should shift energy upward
- Fast tempo should accelerate motion
- Stable personalities should create symmetrical movement
- Emotional personalities should create chaotic fluid motion
- Deep voices should create heavy slow-moving waves

The user's personality should appear to shape the visual environment itself.

---

# MOTION SYSTEM

All motion should feel premium and cinematic.

Use:
- easing
- interpolation
- spring-like movement
- smooth decay
- fluid transitions

Avoid:
- robotic movement
- harsh changes
- jitter
- cheap UI animation

---

# BACKGROUND SYSTEM

The background should dynamically evolve based on personality type.

Requirements:
- animated gradients
- ambient lighting
- soft blur
- glowing atmosphere
- cinematic transitions

Examples:
- energetic personalities → warm colors
- calm personalities → cool gradients
- emotional personalities → purple/pink atmospheres

Transitions must be smooth and immersive.

---

# DASHBOARD UI

Display real-time metrics:
- Volume
- Pitch
- Tempo

Each metric card should include:
- animated gauge
- circular progress ring
- numeric value
- glow effect
- smooth updates

Use glassmorphism styling.

---

# UI STYLE

Use:
- dark futuristic UI
- glassmorphism
- neon glow
- soft blur
- floating panels
- cinematic gradients
- responsive layout
- premium motion

The interface should feel like:
- a next-generation AI operating system
- premium music visualization software
- a sci-fi emotional analysis platform

---

# UX DETAILS

Add:
- startup animation
- idle motion before speaking
- subtle particles
- responsive hover animations
- smooth transitions
- cinematic loading states

Even silence should feel alive.

---

# IMPLEMENTATION RULES

First:
1. Analyze requirements
2. Design architecture
3. Create folder structure
4. Plan audio engine
5. Plan visualization engine
6. Then implement step-by-step

DO NOT immediately generate everything in one file.

Think carefully about:
- scalability
- modularity
- performance
- animation quality
- emotional visual feedback

---

# FINAL GOAL

The final result should feel like:

“A futuristic AI voice personality visualization system where the user's voice dynamically transforms the entire audiovisual environment in real time.”