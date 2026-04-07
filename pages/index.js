import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ConstellationViz = dynamic(() => import('../components/ConstellationViz'), { ssr: false });

/* ─── Anim helpers ─── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
  }
});
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const metrics = [
  { value: '36%', label: 'QA Hours Reduced',    color: 'var(--accent)' },
  { value: '65%', label: 'User Satisfaction Up', color: 'var(--cyan)' },
  { value: '40%', label: 'Faster Bug Detection', color: 'var(--indigo)' },
  { value: '20%', label: 'System Uptime Gained', color: 'var(--violet)' },
];

const lifecycle = [
  { num: '01', title: 'Discovery',    desc: 'Scope, constraints, success metrics', icon: '◇' },
  { num: '02', title: 'Architecture', desc: 'System design & dependency mapping',  icon: '⬡' },
  { num: '03', title: 'Build',        desc: 'Iterative development & code review', icon: '△' },
  { num: '04', title: 'Test',         desc: 'Automated QA & regression suites',    icon: '○' },
  { num: '05', title: 'Deploy',       desc: 'CI/CD pipeline & staged rollout',     icon: '◆' },
  { num: '06', title: 'Measure',      desc: 'SLA monitoring & impact tracking',    icon: '▣' },
];

/* ─── Animated counter ─── */
function AnimatedMetric({ value, color }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState('0');
  const num = parseInt(value);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * num) + '%');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, num]);

  return <span ref={ref} style={{ color }}>{display}</span>;
}

/* ─── Magnetic button ─── */
function MagBtn({ children, className, href }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.12 });
  };
  const inner = (
    <motion.span
      ref={ref}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{ display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const heroY = useTransform(sp, [0, 1], [0, 120]);
  const heroOp = useTransform(sp, [0, 0.7], [1, 0]);
  const heroSc = useTransform(sp, [0, 1], [1, 0.96]);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* ════════ HERO ════════ */}
      <section ref={heroRef} className="hero">
        <div className="hero__constellation"><ConstellationViz /></div>
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
        <div className="hero__glow hero__glow--3" />

        <motion.div className="hero__content container" style={{ y: heroY, opacity: heroOp, scale: heroSc }}>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="hero__text">
            <motion.div className="hero__badge" variants={fadeUp(0)}>
              <span className="hero__badge-dot" />Available for opportunities
            </motion.div>

            <motion.h1 className="hero__title" variants={fadeUp(0.1)}>
              I engineer systems<br />that <span className="hero__accent">move metrics</span>
            </motion.h1>

            <motion.p className="hero__sub" variants={fadeUp(0.2)}>
              Full-stack developer turning complex cloud &amp; enterprise challenges
              into measurable business outcomes — through architecture, automation,
              and relentless optimization.
            </motion.p>

            <motion.div className="hero__actions" variants={fadeUp(0.3)}>
              <MagBtn href="/projects" className="btn btn--primary">
                View Case Studies
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </MagBtn>
              <MagBtn href="/about" className="btn btn--ghost">How I Think</MagBtn>
            </motion.div>

            <motion.div className="hero__legend" variants={fadeUp(0.4)}>
              {[
                { c: '#818cf8', l: 'Cloud' }, { c: '#a78bfa', l: 'Architecture' },
                { c: '#22d3ee', l: 'CI/CD' }, { c: '#f472b6', l: 'Frontend' },
                { c: '#6ee7b7', l: 'Backend' }, { c: '#60a5fa', l: 'Data' },
              ].map(({ c, l }) => (
                <span key={l} className="hero__legend-item">
                  <span className="hero__legend-dot" style={{ background: c, boxShadow: `0 0 8px ${c}44` }} />{l}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="hero__scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.div className="hero__scroll-line" animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </section>

      {/* ════════ METRICS ════════ */}
      <section className="section metrics-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Measured Impact</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>Outcomes, not outputs</motion.h2>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ marginBottom: 64 }}>
              Aggregate impact across two enterprise-scale engagements —
              healthcare claims and financial services infrastructure.
            </motion.p>
          </motion.div>
          <div className="metrics-grid">
            {metrics.map((m, i) => (
              <motion.div key={m.label} className="metric-card" initial={{ opacity: 0, y: 32, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <div className="metric-value"><AnimatedMetric value={m.value} color={m.color} /></div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-bar"><motion.div className="metric-bar__fill" style={{ background: m.color }} initial={{ scaleX: 0 }} whileInView={{ scaleX: parseInt(m.value) / 100 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }} /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ LIFECYCLE ════════ */}
      <section className="section lifecycle-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Process</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>From signal to shipped</motion.h2>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ marginBottom: 72 }}>
              Every phase optimized for speed, reliability, and measurable value delivery.
            </motion.p>
          </motion.div>
          <div className="lifecycle-grid">
            {lifecycle.map((s, i) => (
              <motion.div key={s.num} className="lifecycle-card glass-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -4 }}>
                <div className="lifecycle-card__header">
                  <span className="lifecycle-card__icon">{s.icon}</span>
                  <span className="lifecycle-card__num">{s.num}</span>
                </div>
                <h3 className="lifecycle-card__title">{s.title}</h3>
                <p className="lifecycle-card__desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="section cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp()} style={{ maxWidth: 600, margin: '0 auto' }}>
              Let&apos;s build something that <span style={{ color: 'var(--accent)' }}>matters</span>
            </motion.h2>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ maxWidth: 460, margin: '20px auto 48px' }}>
              Looking for a developer who owns outcomes? Let&apos;s talk about what you&apos;re building.
            </motion.p>
            <motion.div variants={fadeUp(0.2)}>
              <MagBtn href="/contact" className="btn btn--primary">
                Start a Conversation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </MagBtn>
            </motion.div>
          </motion.div>
        </div>
        <div className="cta-section__glow" />
      </section>

      <style jsx global>{`
        .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: var(--nav-height); }
        .hero__constellation { position: absolute; inset: 0; z-index: 0; opacity: 0.55; }
        .hero__glow { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(120px); }
        .hero__glow--1 { width: 700px; height: 700px; top: -15%; right: -8%; background: radial-gradient(circle, rgba(var(--accent-rgb), 0.07), transparent 70%); }
        .hero__glow--2 { width: 500px; height: 500px; bottom: -10%; left: -5%; background: radial-gradient(circle, rgba(var(--indigo-rgb), 0.05), transparent 70%); }
        .hero__glow--3 { width: 400px; height: 400px; top: 40%; left: 30%; background: radial-gradient(circle, rgba(var(--cyan-rgb), 0.03), transparent 70%); }
        .hero__content { position: relative; z-index: 2; padding: 80px 32px; width: 100%; }
        .hero__text { max-width: 640px; }
        .hero__badge { display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 36px; padding: 8px 20px 8px 14px; background: var(--bg-glass); backdrop-filter: blur(16px); border: 1px solid var(--border-glass); border-radius: var(--radius-full); }
        .hero__badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px rgba(var(--accent-rgb), 0.6); animation: pulse-glow 2s ease-in-out infinite; }
        .hero__title { font-size: clamp(44px, 7vw, 76px); font-weight: 800; letter-spacing: -0.045em; line-height: 1.02; color: var(--text-primary); margin-bottom: 28px; }
        .hero__accent { background: linear-gradient(135deg, var(--accent) 0%, var(--cyan) 50%, var(--indigo) 100%); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-shift 5s ease infinite; }
        .hero__sub { font-size: 17px; line-height: 1.75; color: var(--text-secondary); max-width: 520px; margin-bottom: 40px; }
        .hero__actions { display: flex; gap: 14px; margin-bottom: 52px; flex-wrap: wrap; }
        .hero__legend { display: flex; flex-wrap: wrap; gap: 18px; }
        .hero__legend-item { display: flex; align-items: center; gap: 7px; font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 0.5px; }
        .hero__legend-dot { width: 6px; height: 6px; border-radius: 50%; }
        .hero__scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); z-index: 2; }
        .hero__scroll-line { width: 1px; height: 40px; background: var(--accent); transform-origin: top; opacity: 0.3; }
        .metrics-section { background: var(--bg-primary); }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .metric-bar { margin-top: 20px; height: 3px; background: rgba(255,255,255,0.03); border-radius: 2px; overflow: hidden; }
        .metric-bar__fill { height: 100%; border-radius: 2px; transform-origin: left; }
        .lifecycle-section { background: var(--bg-secondary); }
        .lifecycle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lifecycle-card { padding: 32px 28px; }
        .lifecycle-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .lifecycle-card__icon { font-size: 20px; color: var(--accent); }
        .lifecycle-card__num { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 1px; }
        .lifecycle-card__title { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.01em; }
        .lifecycle-card__desc { font-size: 13px; color: var(--text-tertiary); line-height: 1.6; }
        .cta-section { position: relative; overflow: hidden; }
        .cta-section__glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 500px; height: 300px; background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.05), transparent 70%); pointer-events: none; }
        @media (max-width: 1024px) { .metrics-grid { grid-template-columns: repeat(2,1fr); } .lifecycle-grid { grid-template-columns: repeat(2,1fr); } .hero__constellation { opacity: 0.25; } }
        @media (max-width: 640px) { .metrics-grid { grid-template-columns: 1fr; } .lifecycle-grid { grid-template-columns: 1fr; } .hero__title { font-size: clamp(36px,10vw,56px); } }
      `}</style>
    </motion.main>
  );
}
