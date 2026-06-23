/* Tiny Web Audio chiptune engine for the 404 game — no audio files needed.
   Background music loops; blip/select/start are one-shot SFX. A master gain
   node handles muting. Everything is lazily created on first user gesture
   (PLAY NOW), satisfying browser autoplay rules. */

let ctx, master, musicGain, noiseBuf
let playing = false
let step = 0
let nextNoteTime = 0
let timer = null
let muted = true   // start muted — user opts in via the sound button

const A4 = 440
const hz = (semi) => A4 * Math.pow(2, semi / 12) // semitones relative to A4

// 8-bar loop over Am–F–C–G–Am–F–G–E (8th notes). null = rest. (lead +12 oct)
const PROG = [0, -4, -9, -2, 0, -4, -2, -5]   // bar root per bar
const MEL_BARS = [
  [0, null, 7, 0, 3, null, 7, null],
  [8, null, 12, 8, 5, null, 8, null],
  [3, null, 7, 12, 10, null, 7, null],
  [10, null, 14, 10, 7, null, 5, null],
  [12, null, 7, 12, 15, null, 12, 7],
  [8, 12, 8, 5, 8, null, 12, null],
  [15, null, 12, 7, 10, 12, 7, 3],
  [10, 7, 5, 7, 2, null, -2, null],
]
const MELODY = MEL_BARS.flat()
const BASS = PROG.flatMap((r) => [r, null, null, r, null, null, r, null])  // syncopated root
const TEMPO = 150
const STEP = (60 / TEMPO) / 2 // seconds per 8th note
const LEN = MELODY.length     // 64 steps

function ensure() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.45
  master.connect(ctx.destination)
  musicGain = ctx.createGain()
  musicGain.gain.value = 0.55
  musicGain.connect(master)
  // short white-noise buffer for hats/percussion
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
}

function tone(type, freq, time, dur, gainVal, dest) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, time)
  g.gain.linearRampToValueAtTime(gainVal, time + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
  o.connect(g)
  g.connect(dest)
  o.start(time)
  o.stop(time + dur + 0.02)
}

function hat(time) {
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 7000
  src.buffer = noiseBuf
  g.gain.setValueAtTime(0.06, time)
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
  src.connect(hp); hp.connect(g); g.connect(musicGain)
  src.start(time); src.stop(time + 0.06)
}

function scheduleStep(time) {
  const i = step % LEN
  const m = MELODY[i]
  if (m != null) tone('square', hz(m + 12), time, STEP * 0.9, 0.16, musicGain)
  const b = BASS[i]
  if (b != null) tone('triangle', hz(b - 12), time, STEP * 1.6, 0.30, musicGain)
  if (i % 2 === 0) hat(time)
  step++
}

function scheduler() {
  while (nextNoteTime < ctx.currentTime + 0.12) {
    scheduleStep(nextNoteTime)
    nextNoteTime += STEP
  }
}

export function startMusic() {
  ensure()
  if (ctx.state === 'suspended') ctx.resume()
  if (playing) return
  playing = true
  step = 0
  nextNoteTime = ctx.currentTime + 0.1
  timer = setInterval(scheduler, 25)
}

export function stopMusic() {
  playing = false
  if (timer) { clearInterval(timer); timer = null }
}

// SFX -------------------------------------------------------------
export function blip() {
  ensure()
  if (ctx.state === 'suspended') ctx.resume()
  tone('square', hz(7), ctx.currentTime, 0.07, 0.22, master)
}
export function selectSfx() {
  ensure()
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime
  ;[0, 4, 7, 12].forEach((s, i) => tone('square', hz(s + 12), t + i * 0.05, 0.12, 0.2, master))
}
export function startSfx() {
  ensure()
  const t = ctx.currentTime
  ;[0, 7, 12, 16, 19].forEach((s, i) => tone('square', hz(s), t + i * 0.07, 0.16, 0.22, master))
}

export function thud() {            // body hit
  ensure()
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime
  tone('square', hz(-17), t, 0.12, 0.28, master)
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  src.buffer = noiseBuf
  g.gain.setValueAtTime(0.22, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  src.connect(g); g.connect(master)
  src.start(t); src.stop(t + 0.13)
}
export function koJingle() {         // win / KO sting
  ensure()
  const t = ctx.currentTime
  ;[0, 4, 7, 12, 16, 19].forEach((s, i) => tone('square', hz(s), t + i * 0.1, 0.22, 0.22, master))
}
export function loseSfx() {          // player defeat — sad descend
  ensure()
  const t = ctx.currentTime
  ;[7, 3, 0, -5].forEach((s, i) => tone('square', hz(s), t + i * 0.16, 0.26, 0.2, master))
}

export function setMuted(m) {
  muted = m
  if (!ctx) return
  master.gain.setTargetAtTime(m ? 0 : 0.45, ctx.currentTime, 0.02)
}
export function getMuted() { return muted }
