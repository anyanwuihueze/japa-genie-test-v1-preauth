'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { JapaGenieLogo } from '@/components/icons';

const FLAGS = [
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇮🇪', name: 'Ireland' },
  { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇦🇪', name: 'UAE' },
];

const WAITLIST_COUNT = 247;

interface Bouncer {
  id: number;
  flag: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function createBouncer(id: number, w: number, h: number): Bouncer {
  const size = 32 + Math.random() * 24;
  return {
    id,
    flag: FLAGS[id % FLAGS.length].flag,
    x: Math.max(0, Math.random() * Math.max(1, w - size)),
    y: Math.max(0, Math.random() * Math.max(1, h - size)),
    vx: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5),
    vy: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5),
    size,
    opacity: 0.4 + Math.random() * 0.4,
  };
}

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [bouncersReady, setBouncersReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const bouncersRef = useRef<Bouncer[]>([]);
  const rafRef = useRef<number | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const init = () => {
      const el = canvasRef.current;
      if (!el) return;

      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;

      dimsRef.current = { w, h };
      bouncersRef.current = Array.from({ length: FLAGS.length }, (_, i) =>
        createBouncer(i, w, h)
      );
      setBouncersReady(true);
    };

    init();
    const observer = new ResizeObserver(init);
    if (canvasRef.current) observer.observe(canvasRef.current);
    window.addEventListener('resize', init);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', init);
    };
  }, []);

  useEffect(() => {
    if (!bouncersReady) return;

    const animate = () => {
      const { w, h } = dimsRef.current;
      if (w > 0 && h > 0) {
        bouncersRef.current.forEach((b) => {
          let nx = b.x + b.vx;
          let ny = b.y + b.vy;

          if (nx <= 0 || nx >= Math.max(0, w - b.size)) {
            b.vx = -b.vx;
            nx = Math.max(0, Math.min(nx, Math.max(0, w - b.size)));
          }
          if (ny <= 0 || ny >= Math.max(0, h - b.size)) {
            b.vy = -b.vy;
            ny = Math.max(0, Math.min(ny, Math.max(0, h - b.size)));
          }
          b.x = nx;
          b.y = ny;
        });

        const elements = canvasRef.current?.querySelectorAll<HTMLSpanElement>('.bouncer');
        elements?.forEach((el, i) => {
          const b = bouncersRef.current[i];
          if (!b) return;
          el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
        });
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [bouncersReady]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (touch.clientX - rect.left - rect.width / 2) / rect.width,
        y: (touch.clientY - rect.top - rect.height / 2) / rect.height,
      });
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => window.removeEventListener('touchmove', handleTouch);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email.trim()) {
        setSubmitted(true);
        setEmail('');
      }
    },
    [email]
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* bouncing flags canvas */}
      <div ref={canvasRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {bouncersReady &&
          bouncersRef.current.map((b) => (
            <span
              key={b.id}
              className="bouncer absolute select-none will-change-transform"
              style={{
                left: 0,
                top: 0,
                opacity: b.opacity,
                fontSize: `${b.size}px`,
                lineHeight: 1,
              }}
            >
              {b.flag}
            </span>
          ))}
      </div>

      {/* ambient glow orbs with parallax */}
      <div
        className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translate(${mouse.x * -40}px, ${mouse.y * -40}px)` }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translate(${mouse.x * 50}px, ${mouse.y * 50}px)` }}
      />

      {/* center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <div
          className="transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px)` }}
        >
          <JapaGenieLogo className="w-20 h-20 md:w-24 md:h-24 animate-glow" />
        </div>

        <span className="mt-8 text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-slate-400 animate-fadeInUp">
          Japa Genie
        </span>

        <h1
          className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-fadeInUp"
          style={{ animationDelay: '0.1s' }}
        >
          Bouncing back
          <br />
          better.
        </h1>

        <p
          className="mt-5 text-slate-300 text-base md:text-lg leading-relaxed max-w-lg animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          We're taking a moment to rebuild the experience your visa journey deserves.
          Sharper tools, clearer guidance, same mission.
        </p>

        <div
          className="mt-8 flex items-center gap-2.5 px-5 py-2 rounded-full border border-slate-700 bg-slate-800/60 animate-fadeInUp"
          style={{ animationDelay: '0.35s' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
          </span>
          <span className="text-slate-300 text-sm font-medium tracking-wide">Returning Soon</span>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm animate-fadeInUp"
            style={{ animationDelay: '0.45s' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div
            className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fadeInUp"
            style={{ animationDelay: '0.45s' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You're on the list. We'll be in touch.
          </div>
        )}

        <p
          className="mt-4 text-slate-500 text-xs animate-fadeInUp"
          style={{ animationDelay: '0.55s' }}
        >
          Join {WAITLIST_COUNT.toLocaleString()} others already waiting.
        </p>
      </div>

      {/* scrolling country ticker */}
      <div className="absolute bottom-8 opacity-60 z-10">
        <div className="animate-ticker flex gap-10 whitespace-nowrap">
          {[...FLAGS, ...FLAGS].map((f, i) => (
            <span key={i} className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="text-lg">{f.flag}</span>
              {f.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
