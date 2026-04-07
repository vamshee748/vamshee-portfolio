import { motion } from 'framer-motion';
import { useRef, useEffect, useCallback } from 'react';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }
});
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const methods = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    label: 'Email', value: 'vamshee748@gmail.com', href: 'mailto:vamshee748@gmail.com',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Phone', value: '(470) 467-5480', href: 'tel:+14704675480',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Location', value: 'Atlanta, GA', href: null,
  },
];

/* ─── Particle field background ─── */
function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = c.width / dpr;
    const H = c.height / dpr;
    const t = performance.now() * 0.001;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < 40; i++) {
      const x = ((Math.sin(t * 0.1 + i * 1.7) + 1) / 2) * W;
      const y = ((Math.cos(t * 0.08 + i * 2.3) + 1) / 2) * H;
      const r = 1 + Math.sin(t + i) * 0.5;
      const a = 0.12 + Math.sin(t * 0.5 + i) * 0.08;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110, 231, 183, ${a})`;
      ctx.fill();
    }
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c.getBoundingClientRect();
      c.width = rect.width * dpr;
      c.height = rect.height * dpr;
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, [draw]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.5 }} />;
}

export default function Contact() {

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <section className="section contact-section" style={{ paddingTop: 'calc(var(--nav-height) + 80px)' }}>
        <ParticleField />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="contact-layout">
            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.span className="section-label" variants={fadeUp()}>Get in Touch</motion.span>
              <motion.h1 className="section-title" variants={fadeUp(0.05)}>
                Let&apos;s build<br /><span style={{ color: 'var(--accent)' }}>something together</span>
              </motion.h1>
              <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ marginBottom: 48 }}>
                Whether you&apos;re exploring candidates, scoping a project, or just want to
                connect — I&apos;d love to hear what you&apos;re working on.
              </motion.p>

              <div className="contact-methods">
                {methods.map((m, i) => (
                  <motion.a
                    key={m.label}
                    href={m.href}
                    className="cm glass-card"
                    variants={fadeUp(0.15 + i * 0.05)}
                    whileHover={m.href ? { x: 4 } : {}}
                    style={{ cursor: m.href ? 'pointer' : 'default' }}
                  >
                    <div className="cm__icon">{m.icon}</div>
                    <div>
                      <span className="cm__label">{m.label}</span>
                      <span className="cm__value">{m.value}</span>
                    </div>
                  </motion.a>
                ))}
              </div>

              <motion.div className="contact-signal glass-card" variants={fadeUp(0.35)}>
                <span className="contact-signal__dot" />
                Currently open to full-time and select contract opportunities
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .contact-section { position: relative; overflow: hidden; min-height: 100vh; }
        .contact-layout { max-width: 600px; margin: 0 auto; }
        .contact-methods { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .cm { display: flex; align-items: center; gap: 16px; padding: 18px 22px; }
        .cm__icon { flex-shrink: 0; }
        .cm__label { display: block; font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 2px; }
        .cm__value { display: block; font-size: 15px; font-weight: 500; color: var(--text-primary); }
        .contact-signal { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text-tertiary); padding: 14px 18px; }
        .contact-signal__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.4); animation: pulse-glow 2s ease-in-out infinite; flex-shrink: 0; }
      `}</style>
    </motion.main>
  );
}
