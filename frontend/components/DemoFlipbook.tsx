'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

const NUM_PAGES   = 8
const NUM_SPREADS = 4
const PAGE_W      = 110
const PAGE_H      = 154

const THEMES = [
  { bg: 'linear-gradient(150deg,#4F46E5,#7C3AED)', dark: true  },
  { bg: 'linear-gradient(150deg,#EEF2FF,#DDD6FE)', dark: false },
  { bg: 'linear-gradient(150deg,#FFFBEB,#FDE68A)', dark: false },
  { bg: 'linear-gradient(150deg,#ECFDF5,#A7F3D0)', dark: false },
  { bg: 'linear-gradient(150deg,#FDF4FF,#F0ABFC)', dark: false },
  { bg: 'linear-gradient(150deg,#EFF6FF,#BFDBFE)', dark: false },
  { bg: 'linear-gradient(150deg,#FFF1F2,#FECDD3)', dark: false },
  { bg: 'linear-gradient(150deg,#1E1B4B,#4C1D95)', dark: true  },
]

function PageFace({ idx }: { idx: number }) {
  const t      = THEMES[idx % THEMES.length]
  const line   = t.dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.09)'
  const circle = t.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
  const label  = t.dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.20)'

  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 5, padding: '10px 14px',
    }}>
      <div style={{ width:26, height:26, borderRadius:'50%', background:circle, marginBottom:4, flexShrink:0 }}/>
      {[50,38,46,34,42].map((w,i) => (
        <div key={i} style={{ height:4, width:w, background:line, borderRadius:2, flexShrink:0 }}/>
      ))}
      <div style={{ marginTop:8, fontSize:9, fontFamily:'monospace', color:label }}>
        {idx + 1} / {NUM_PAGES}
      </div>
    </div>
  )
}

type Dir = 'forward' | 'backward'

export default function DemoFlipbook() {
  const [spread,  setSpread]  = useState(0)
  const [flip,    setFlip]    = useState<{ dir: Dir; next: number } | null>(null)
  const [autoDir, setAutoDir] = useState<Dir>('forward')

  const animating = flip !== null
  const animRef   = useRef(false)
  animRef.current = animating

  /* ── Manual navigation ───────────────────────────────────── */
  const go = useCallback((dir: Dir) => {
    if (animating) return
    const next = dir === 'forward' ? spread + 1 : spread - 1
    if (next < 0 || next >= NUM_SPREADS) return
    setFlip({ dir, next })
  }, [animating, spread])

  /* ── Animation end handler ───────────────────────────────── */
  const onAnimEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    setSpread(flip?.next ?? spread)
    setFlip(null)
  }, [flip, spread])

  /* ── Boomerang auto-advance ──────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (animRef.current) return
      if (autoDir === 'forward') {
        if (spread < NUM_SPREADS - 1) {
          setFlip({ dir: 'forward', next: spread + 1 })
        } else {
          setAutoDir('backward')
          setFlip({ dir: 'backward', next: spread - 1 })
        }
      } else {
        if (spread > 0) {
          setFlip({ dir: 'backward', next: spread - 1 })
        } else {
          setAutoDir('forward')
          setFlip({ dir: 'forward', next: spread + 1 })
        }
      }
    }, 2200)
    return () => clearTimeout(t)
  }, [spread, autoDir])

  /* ── Derive which page index goes where ──────────────────── */
  const s = spread, ns = flip?.next ?? spread, d = flip?.dir
  let sL: number, sR: number, fFront: number, fBack: number

  if (d === 'forward') {
    // static left = current left (stays)
    // static right = NEXT right (revealed as flip moves away)
    // flip front  = current right
    // flip back   = next left
    sL = s*2;  sR = ns*2+1;  fFront = s*2+1;   fBack = ns*2
  } else if (d === 'backward') {
    // static left = PREVIOUS left (revealed as flip moves right)
    // static right = current right (stays)
    // flip front  = previous right
    // flip back   = current left
    sL = ns*2; sR = s*2+1;   fFront = ns*2+1;  fBack = s*2
  } else {
    sL = s*2;  sR = s*2+1;   fFront = s*2+1;   fBack = s*2
  }

  const canPrev = spread > 0 && !animating
  const canNext = spread < NUM_SPREADS - 1 && !animating

  return (
    <>
      <style>{`
        @keyframes flip-fwd {
          from { transform: rotateY(0deg);    }
          to   { transform: rotateY(-180deg); }
        }
        @keyframes flip-bwd {
          from { transform: rotateY(-180deg); }
          to   { transform: rotateY(0deg);    }
        }
        .fm-fwd  { animation: flip-fwd 0.75s cubic-bezier(0.645,0.045,0.355,1) forwards; }
        .fm-bwd  { animation: flip-bwd 0.75s cubic-bezier(0.645,0.045,0.355,1) forwards; }
        .fm-book { -webkit-transform-style: preserve-3d; transform-style: preserve-3d; }
        .fm-flip { -webkit-transform-style: preserve-3d; transform-style: preserve-3d; }
        .fm-face {
          position: absolute; inset: 0;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          overflow: hidden;
        }
        .fm-nav { transition: background 0.15s, color 0.15s; font-family: inherit; }
        .fm-nav:not(:disabled):hover { background: rgba(255,255,255,0.15) !important; }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>

        {/* ── Book viewport ───────────────────────────────── */}
        <div style={{ perspective:'1400px', perspectiveOrigin:'50% 45%' }}>
          <div
            className="fm-book"
            style={{
              position: 'relative',
              width: PAGE_W * 2, height: PAGE_H,
              borderRadius: 6,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            {/* Left static page */}
            <div style={{
              position:'absolute', left:0, top:0,
              width:PAGE_W, height:PAGE_H,
              overflow:'hidden', borderRadius:'6px 0 0 6px',
              zIndex:1, boxShadow:'inset -10px 0 24px rgba(0,0,0,0.15)',
            }}>
              <PageFace idx={sL} />
            </div>

            {/* Right static page */}
            <div style={{
              position:'absolute', left:PAGE_W, top:0,
              width:PAGE_W, height:PAGE_H,
              overflow:'hidden', borderRadius:'0 6px 6px 0',
              zIndex:1, boxShadow:'inset 10px 0 24px rgba(0,0,0,0.06)',
            }}>
              <PageFace idx={sR} />
            </div>

            {/* Spine */}
            <div style={{
              position:'absolute', left:PAGE_W-1, top:0,
              width:2, height:PAGE_H,
              background:'rgba(0,0,0,0.25)',
              zIndex:5, pointerEvents:'none',
            }}/>

            {/* Flipping page — positioned on right half, origin at left (spine) */}
            {animating && (
              <div
                className={`fm-flip ${d === 'forward' ? 'fm-fwd' : 'fm-bwd'}`}
                onAnimationEnd={onAnimEnd}
                style={{
                  position:'absolute', left:PAGE_W, top:0,
                  width:PAGE_W, height:PAGE_H,
                  transformOrigin:'left center',
                  zIndex:3,
                }}
              >
                {/* Front face (visible at 0deg — right side) */}
                <div className="fm-face">
                  <PageFace idx={fFront} />
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to left, transparent 40%, rgba(0,0,0,0.14))',
                    pointerEvents:'none',
                  }}/>
                </div>

                {/* Back face (visible at -180deg — left side) */}
                <div className="fm-face" style={{ transform:'rotateY(180deg)' }}>
                  <PageFace idx={fBack} />
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to right, transparent 40%, rgba(0,0,0,0.10))',
                    pointerEvents:'none',
                  }}/>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Controls ────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button
            className="fm-nav"
            onClick={() => go('backward')}
            disabled={!canPrev}
            style={{
              background:'rgba(255,255,255,0.08)',
              border:'0.5px solid rgba(255,255,255,0.15)',
              borderRadius:8, fontSize:13, padding:'6px 16px',
              color: canPrev ? '#fff' : 'rgba(255,255,255,0.25)',
              cursor: canPrev ? 'pointer' : 'default',
            }}
          >← Prev</button>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', minWidth:60, textAlign:'center' }}>
            {s*2+1}–{s*2+2} / {NUM_PAGES}
          </span>
          <button
            className="fm-nav"
            onClick={() => go('forward')}
            disabled={!canNext}
            style={{
              background:'rgba(255,255,255,0.08)',
              border:'0.5px solid rgba(255,255,255,0.15)',
              borderRadius:8, fontSize:13, padding:'6px 16px',
              color: canNext ? '#fff' : 'rgba(255,255,255,0.25)',
              cursor: canNext ? 'pointer' : 'default',
            }}
          >Next →</button>
        </div>

      </div>
    </>
  )
}