import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const ConstellationViz = dynamic(() => import('../components/ConstellationViz'), { ssr: false });

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }
});
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── EXPERIENCE DATA ─── */
const experience = [
  {
    period: 'Jul 2023 – Present',
    role: 'Software Developer',
    domain: 'Healthcare Technology',
    tagColor: 'var(--accent)',
    desc: 'Claims management platform serving analysts and operations managers. Full-stack ownership from UI components to backend performance tuning.',
    metrics: [
      { val: '36%', label: 'QA hours cut',      color: 'var(--accent)' },
      { val: '65%', label: 'Satisfaction up',    color: 'var(--cyan)' },
      { val: '40%', label: 'Faster bug finding', color: 'var(--indigo)' },
    ],
    tech: ['React', 'Java', 'Spring Boot', 'JWT', 'Azure', 'Jenkins', 'Oracle'],
  },
  {
    period: 'Sep 2022 – Jul 2023',
    role: 'Software Developer',
    domain: 'Financial Services',
    tagColor: 'var(--indigo)',
    desc: 'Payment processing on cloud infrastructure. Reliability, security hardening, and serverless automation at scale.',
    metrics: [
      { val: '20%', label: 'Reliability up',    color: 'var(--accent)' },
      { val: '40%', label: 'Fewer incidents',    color: 'var(--violet)' },
      { val: '30%', label: 'Faster audits',      color: 'var(--cyan)' },
      { val: '25%', label: 'Less manual work',   color: 'var(--amber)' },
    ],
    tech: ['Azure VMs', 'Blob Storage', 'Functions', 'RBAC', 'Monitor', 'Service Bus'],
  },
];

/* ─── ARCHITECTURE CANVAS ─── */
function ArchCanvas({ className }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const layers = [
    { y: 0.12, label: 'CLIENT', items: ['React SPA', 'REST Consumers', 'Mobile APIs'], color: { r: 244, g: 114, b: 182 } },
    { y: 0.30, label: 'API GATEWAY', items: ['Auth (JWT)', 'Rate Limiting', 'Routing'], color: { r: 110, g: 231, b: 183 } },
    { y: 0.48, label: 'SERVICES', items: ['Microservices', 'Event Bus', 'Workers'], color: { r: 129, g: 140, b: 248 } },
    { y: 0.66, label: 'DATA', items: ['Oracle / MySQL', 'MongoDB', 'Blob Storage'], color: { r: 96, g: 165, b: 250 } },
    { y: 0.84, label: 'INFRA', items: ['Azure VMs', 'Functions', 'Monitor'], color: { r: 167, g: 139, b: 250 } },
  ];

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width / (window.devicePixelRatio || 1);
    const H = c.height / (window.devicePixelRatio || 1);
    const t = performance.now() * 0.001;
    const m = mouseRef.current;
    ctx.clearRect(0, 0, W, H);

    /* Draw layers */
    layers.forEach((layer, li) => {
      const ly = layer.y * H;
      const cols = layer.items.length;
      const spacing = W / (cols + 1);

      /* Layer label */
      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},0.35)`;
      ctx.textAlign = 'left';
      ctx.fillText(layer.label, 12, ly - 16);

      /* Horizontal line */
      ctx.beginPath();
      ctx.moveTo(20, ly);
      ctx.lineTo(W - 20, ly);
      ctx.strokeStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      layer.items.forEach((item, ii) => {
        const nx = spacing * (ii + 1);
        const ny = ly;
        const dist = Math.hypot(m.x - nx, m.y - ny);
        const prox = Math.max(0, 1 - dist / 120);
        const breath = Math.sin(t * 1.2 + li * 1.5 + ii) * 2;
        const r = 18 + prox * 8 + breath;

        /* Glow */
        if (prox > 0.1) {
          const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.5);
          g.addColorStop(0, `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${0.1 * prox})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(nx, ny, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        /* Node */
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        const ng = ctx.createRadialGradient(nx - r * 0.2, ny - r * 0.2, 0, nx, ny, r);
        ng.addColorStop(0, `rgba(${Math.min(255, layer.color.r + 30)},${Math.min(255, layer.color.g + 30)},${Math.min(255, layer.color.b + 30)},${0.55 + prox * 0.35})`);
        ng.addColorStop(1, `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${0.25 + prox * 0.3})`);
        ctx.fillStyle = ng;
        ctx.fill();

        /* Ring */
        ctx.beginPath();
        ctx.arc(nx, ny, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${0.06 + prox * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        /* Label */
        ctx.font = `${prox > 0.2 ? 500 : 400} ${10 + prox * 2}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(240,240,245,${0.4 + prox * 0.5})`;
        ctx.fillText(item, nx, ny + r + 14);
      });

      /* Vertical connectors to next layer */
      if (li < layers.length - 1) {
        const nextY = layers[li + 1].y * H;
        const nextCols = layers[li + 1].items.length;
        const nextSpacing = W / (nextCols + 1);
        layer.items.forEach((_, ii) => {
          const sx = spacing * (ii + 1);
          layers[li + 1].items.forEach((_, ji) => {
            const ex = nextSpacing * (ji + 1);
            const mx = (sx + ex) / 2;
            const my = (ly + nextY) / 2;
            const d = Math.hypot(m.x - mx, m.y - my);
            const p = Math.max(0, 1 - d / 140);
            ctx.beginPath();
            ctx.moveTo(sx, ly + 20);
            ctx.quadraticCurveTo((sx + ex) / 2, (ly + nextY) / 2, ex, nextY - 20);
            ctx.strokeStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${0.03 + p * 0.12})`;
            ctx.lineWidth = 0.5 + p * 1;
            ctx.stroke();
          });
        });
      }
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMouse = (e) => { const r = c.getBoundingClientRect(); mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const onLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    resize();
    window.addEventListener('resize', resize);
    c.addEventListener('mousemove', onMouse);
    c.addEventListener('mouseleave', onLeave);
    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      c.removeEventListener('mousemove', onMouse);
      c.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

/* ─── ANIMATED METRIC BAR ─── */
function MetricBar({ val, label, color, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const num = parseInt(val);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const dur = 1000;
    const s = performance.now();
    const tick = (n) => {
      const p = Math.min((n - s) / dur, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * num) + '%');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);

  return (
    <div ref={ref} className="mbar">
      <div className="mbar__top">
        <span className="mbar__val" style={{ color }}>{display}</span>
        <span className="mbar__label">{label}</span>
      </div>
      <div className="mbar__track">
        <motion.div
          className="mbar__fill"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: num / 100 } : {}}
          transition={{ delay: delay + 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ─── SKILLS DATA ─── */
const skillGroups = [
  { title: 'Languages', items: ['Java', 'C++', 'JavaScript', 'PL/SQL', 'Node.js'], color: 'var(--accent)' },
  { title: 'Frontend', items: ['React', 'Angular', 'HTML5/CSS3', 'Bootstrap', 'jQuery'], color: 'var(--pink)' },
  { title: 'Backend & APIs', items: ['Spring Boot', 'Django', '.NET', 'REST', 'Microservices'], color: 'var(--accent)' },
  { title: 'Cloud', items: ['Azure VMs', 'Blob Storage', 'Functions', 'Entra ID', 'Monitor', 'Service Bus'], color: 'var(--indigo)' },
  { title: 'Data', items: ['Oracle', 'MySQL', 'MongoDB', 'NoSQL'], color: 'var(--blue)' },
  { title: 'DevOps', items: ['Jenkins', 'CI/CD', 'Maven', 'Git'], color: 'var(--cyan)' },
];

export default function About() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* ═══ INTRO ═══ */}
      <section className="section" style={{ paddingTop: 'calc(var(--nav-height) + 80px)' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>About</motion.span>
            <motion.h1 className="section-title" variants={fadeUp(0.05)} style={{ maxWidth: 720 }}>
              Systems thinker who<br /><span style={{ color: 'var(--accent)' }}>ships with intention</span>
            </motion.h1>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ maxWidth: 640, marginBottom: 20 }}>
              Software developer based in Atlanta with a background in CS and information security.
              I approach every project as a system — mapping dependencies, identifying bottlenecks,
              building solutions that create compounding value.
            </motion.p>
            <motion.p className="section-desc" variants={fadeUp(0.15)} style={{ maxWidth: 640 }}>
              My work spans full-stack product development, cloud infrastructure, and 
              performance engineering — always tied to a measurable outcome.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SYSTEM ARCHITECTURE ═══ */}
      <section className="section arch-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>System Architecture</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>How I think about systems</motion.h2>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ marginBottom: 48 }}>
              Layered architecture with clear boundaries between concerns. Hover to explore.
            </motion.p>
          </motion.div>
          <motion.div
            className="arch-canvas-wrap"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArchCanvas className="arch-canvas" />
          </motion.div>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Experience</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>Where I&apos;ve made impact</motion.h2>
          </motion.div>

          <div className="exp-stack">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                className="exp-card glass-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
              >
                <div className="exp-card__top">
                  <div>
                    <span className="exp-card__date">{exp.period}</span>
                    <h3 className="exp-card__role">{exp.role}</h3>
                    <span className="exp-card__domain" style={{ color: exp.tagColor }}>{exp.domain}</span>
                  </div>
                </div>
                <p className="exp-card__desc">{exp.desc}</p>

                <div className="exp-card__metrics">
                  {exp.metrics.map((m, mi) => (
                    <MetricBar key={mi} val={m.val} label={m.label} color={m.color} delay={mi * 0.08} />
                  ))}
                </div>

                <div className="exp-card__tags">
                  {exp.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONSTELLATION SKILLS MAP ═══ */}
      <section className="section constellation-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Technical Map</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>The constellation</motion.h2>
            <motion.p className="section-desc" variants={fadeUp(0.1)} style={{ marginBottom: 16 }}>
              Skills organized as an interactive network. Hover to explore clusters and connections.
            </motion.p>
          </motion.div>
        </div>
        <motion.div
          className="constellation-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <ConstellationViz />
          <div className="constellation-fade constellation-fade--l" />
          <div className="constellation-fade constellation-fade--r" />
        </motion.div>
        <div className="container">
          <div className="skill-pills">
            {skillGroups.map((g, gi) => (
              <motion.div
                key={g.title}
                className="skill-group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.06, duration: 0.5 }}
              >
                <span className="skill-group__title" style={{ color: g.color }}>{g.title}</span>
                <div className="skill-group__items">
                  {g.items.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDUCATION ═══ */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Education</motion.span>
            <motion.h2 className="section-title" variants={fadeUp(0.05)}>Foundation</motion.h2>
          </motion.div>
          <motion.div
            className="edu-card glass-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="edu-card__icon">🎓</div>
            <div>
              <h3 className="edu-card__degree">M.S. in Computer &amp; Information Systems Security</h3>
              <p className="edu-card__school">Auburn University at Montgomery</p>
              <p className="edu-card__date">Aug 2021 – Aug 2022 · Montgomery, AL</p>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        /* Arch section */
        .arch-section { background: var(--bg-secondary); }
        .arch-canvas-wrap { height: 500px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); background: var(--bg-card); }
        .arch-canvas { cursor: crosshair; }

        /* Experience */
        .exp-stack { display: flex; flex-direction: column; gap: 24px; margin-top: 48px; }
        .exp-card { padding: 40px; }
        .exp-card__top { margin-bottom: 16px; }
        .exp-card__date { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.5px; }
        .exp-card__role { font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 6px 0 4px; letter-spacing: -0.02em; }
        .exp-card__domain { font-size: 14px; font-weight: 600; }
        .exp-card__desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; max-width: 640px; }
        .exp-card__metrics { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; max-width: 500px; }
        .exp-card__tags { display: flex; flex-wrap: wrap; gap: 6px; }

        .mbar {}
        .mbar__top { display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }
        .mbar__val { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .mbar__label { font-size: 12px; color: var(--text-tertiary); }
        .mbar__track { height: 4px; background: rgba(255,255,255,0.03); border-radius: 2px; overflow: hidden; }
        .mbar__fill { height: 100%; border-radius: 2px; transform-origin: left; }

        /* Constellation section */
        .constellation-section { background: var(--bg-secondary); overflow: hidden; }
        .constellation-wrap { position: relative; height: 480px; margin: 32px 0 48px; }
        .constellation-fade { position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .constellation-fade--l { left: 0; background: linear-gradient(90deg, var(--bg-secondary), transparent); }
        .constellation-fade--r { right: 0; background: linear-gradient(-90deg, var(--bg-secondary), transparent); }
        .skill-pills { display: flex; flex-wrap: wrap; gap: 24px; }
        .skill-group { display: flex; flex-direction: column; gap: 8px; }
        .skill-group__title { font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        .skill-group__items { display: flex; flex-wrap: wrap; gap: 6px; }

        /* Education */
        .edu-card { display: flex; align-items: center; gap: 24px; padding: 36px; margin-top: 32px; max-width: 600px; }
        .edu-card__icon { font-size: 36px; flex-shrink: 0; }
        .edu-card__degree { font-size: 17px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .edu-card__school { font-size: 14px; color: var(--text-secondary); margin-bottom: 2px; }
        .edu-card__date { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }

        @media (max-width: 768px) {
          .arch-canvas-wrap { height: 400px; }
          .constellation-wrap { height: 360px; }
          .exp-card { padding: 24px; }
        }
      `}</style>
    </motion.main>
  );
}
