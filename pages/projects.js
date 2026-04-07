import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }
});
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── CASE STUDY DATA ─── */
const studies = [
  {
    id: 'claims',
    tag: 'Healthcare Tech',
    tagColor: 'var(--accent)',
    title: 'Claims Processing Automation',
    brief: 'Transformed a manual-heavy claims workflow into an automated, component-driven platform — cutting QA overhead and lifting user satisfaction by 65%.',
    problem: 'Claims management relied on manual QA. Testers spent disproportionate hours on repetitive validation, bug detection was slow, and the UI lacked component architecture for rapid iteration. Analyst workflows were fragmented.',
    approach: [
      'Audited QA workflows — identified repetitive validation patterns suitable for automation',
      'Built reusable React component library with standardized APIs for data display',
      'Developed RESTful APIs consolidating database queries — reducing frontend complexity',
      'Implemented JWT auth and role-based access for analysts vs. managers',
      'Applied multithreading & GC tuning in Java backend to eliminate response bottlenecks',
      'Established Jenkins CI/CD pipeline for automated testing and staged Azure deployments',
    ],
    results: [
      { val: '36%', label: 'QA hours reduced', desc: 'Automated regression suites replaced repetitive manual cycles', color: 'var(--accent)' },
      { val: '40%', label: 'Faster bug detection', desc: 'Automated coverage caught regressions earlier in pipeline', color: 'var(--cyan)' },
      { val: '65%', label: 'User satisfaction up', desc: 'Measured via post-deploy surveys — faster UI, cleaner workflows', color: 'var(--indigo)' },
    ],
    tech: ['React', 'Java', 'Spring Boot', 'JWT', 'Azure', 'Jenkins', 'Oracle', 'REST APIs'],
    pipeline: [
      { label: 'User', cat: 'input', color: '#f472b6' },
      { label: 'React SPA', cat: 'frontend', color: '#f472b6' },
      { label: 'REST API', cat: 'gateway', color: '#6ee7b7' },
      { label: 'JWT Auth', cat: 'security', color: '#fbbf24' },
      { label: 'Spring', cat: 'backend', color: '#6ee7b7' },
      { label: 'Oracle DB', cat: 'data', color: '#60a5fa' },
      { label: 'Response', cat: 'output', color: '#6ee7b7' },
    ],
  },
  {
    id: 'payments',
    tag: 'Financial Services',
    tagColor: 'var(--indigo)',
    title: 'Cloud Payment Infrastructure',
    brief: 'Architected and hardened a cloud-native payment pipeline on Azure — 20% reliability gain, 40% fewer security incidents.',
    problem: 'Payment servers hit scalability limits during peak cycles, causing degradation. Transaction storage lacked compliance-grade durability. Manual intervention was required in the pipeline, and security posture had access control gaps.',
    approach: [
      'Migrated to Azure VMs with Autoscale policies tied to transaction volume patterns',
      'Implemented Blob Storage for transaction archival with immutability policies for compliance',
      'Built serverless workflows via Azure Functions — eliminated manual pipeline steps',
      'Configured RBAC and Managed Identities for least-privilege access across all services',
      'Deployed Azure Monitor dashboards and Activity Log alerting for proactive detection',
    ],
    results: [
      { val: '20%', label: 'Reliability increase', desc: 'Autoscale eliminated degradation during peak transaction cycles', color: 'var(--accent)' },
      { val: '30%', label: 'Faster audit response', desc: 'Compliance-tagged Blob Storage streamlined regulatory retrieval', color: 'var(--cyan)' },
      { val: '40%', label: 'Fewer security incidents', desc: 'RBAC + Managed Identities closed access control gaps', color: 'var(--violet)' },
      { val: '25%', label: 'Less manual work', desc: 'Azure Functions automated previously manual stages', color: 'var(--amber)' },
      { val: '20%', label: 'Downtime cut', desc: 'Proactive monitoring caught issues before escalation', color: 'var(--indigo)' },
    ],
    tech: ['Azure VMs', 'Blob Storage', 'Azure Functions', 'RBAC', 'Managed Identities', 'Monitor', 'Service Bus'],
    pipeline: [
      { label: 'Transaction', cat: 'input', color: '#fbbf24' },
      { label: 'API GW', cat: 'gateway', color: '#6ee7b7' },
      { label: 'RBAC', cat: 'security', color: '#f472b6' },
      { label: 'Function', cat: 'compute', color: '#818cf8' },
      { label: 'Svc Bus', cat: 'messaging', color: '#a78bfa' },
      { label: 'Blob Store', cat: 'data', color: '#60a5fa' },
      { label: 'Monitor', cat: 'observability', color: '#22d3ee' },
    ],
  },
];

/* ─── PIPELINE CANVAS ─── */
function PipelineCanvas({ pipeline }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = c.width / dpr;
    const H = c.height / dpr;
    const t = performance.now() * 0.001;
    const m = mouseRef.current;
    ctx.clearRect(0, 0, W, H);

    const nodeCount = pipeline.length;
    const spacing = W / (nodeCount + 1);
    const cy = H / 2;

    /* Connections */
    for (let i = 0; i < nodeCount - 1; i++) {
      const x1 = spacing * (i + 1);
      const x2 = spacing * (i + 2);
      const mid = (x1 + x2) / 2;
      const d = Math.hypot(m.x - mid, m.y - cy);
      const p = Math.max(0, 1 - d / 120);

      ctx.beginPath();
      ctx.moveTo(x1 + 24, cy);
      ctx.lineTo(x2 - 24, cy);
      const hex = pipeline[i].color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.1 + p * 0.3})`;
      ctx.lineWidth = 1 + p * 1.5;
      ctx.stroke();

      /* Arrow head */
      ctx.beginPath();
      const ax = x2 - 28;
      ctx.moveTo(ax, cy - 4);
      ctx.lineTo(ax + 6, cy);
      ctx.lineTo(ax, cy + 4);
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 + p * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Traveling particle */
      const pp = ((t * 0.3 + i * 0.15) % 1);
      const px = x1 + 24 + (x2 - x1 - 48) * pp;
      ctx.beginPath();
      ctx.arc(px, cy, 2 + p * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.4 + p * 0.4})`;
      ctx.fill();
    }

    /* Nodes */
    pipeline.forEach((node, i) => {
      const nx = spacing * (i + 1);
      const dist = Math.hypot(m.x - nx, m.y - cy);
      const prox = Math.max(0, 1 - dist / 100);
      const breath = Math.sin(t * 1.3 + i * 0.8) * 1.5;
      const nr = 20 + prox * 8 + breath;

      const hex = node.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      /* Glow */
      if (prox > 0.05) {
        const grd = ctx.createRadialGradient(nx, cy, 0, nx, cy, nr * 3);
        grd.addColorStop(0, `rgba(${r},${g},${b},${0.12 * prox})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(nx, cy, nr * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      /* Ring */
      ctx.beginPath();
      ctx.arc(nx, cy, nr + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.06 + prox * 0.15})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      /* Core */
      const cg = ctx.createRadialGradient(nx - nr * 0.2, cy - nr * 0.2, 0, nx, cy, nr);
      cg.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${0.65 + prox * 0.3})`);
      cg.addColorStop(1, `rgba(${r},${g},${b},${0.3 + prox * 0.35})`);
      ctx.beginPath();
      ctx.arc(nx, cy, nr, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      /* Label */
      ctx.font = `${prox > 0.2 ? 600 : 500} ${10 + prox * 2}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(240,240,245,${0.45 + prox * 0.5})`;
      ctx.fillText(node.label, nx, cy + nr + 16);

      /* Category micro-label */
      ctx.font = '400 8px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + prox * 0.4})`;
      ctx.fillText(node.cat.toUpperCase(), nx, cy - nr - 8);
    });

    animRef.current = requestAnimationFrame(draw);
  }, [pipeline]);

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

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />;
}

/* ─── RESULT BAR ─── */
function ResultBar({ val, label, desc, color, delay = 0 }) {
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
    <div ref={ref} className="rb">
      <div className="rb__head">
        <span className="rb__val" style={{ color }}>{display}</span>
        <div>
          <span className="rb__label">{label}</span>
          <span className="rb__desc">{desc}</span>
        </div>
      </div>
      <div className="rb__track">
        <motion.div className="rb__fill" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: num / 100 } : {}} transition={{ delay: delay + 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </div>
  );
}

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* HEADER */}
      <section className="section" style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: 64 }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span className="section-label" variants={fadeUp()}>Case Studies</motion.span>
            <motion.h1 className="section-title" variants={fadeUp(0.05)} style={{ maxWidth: 650 }}>
              Impact-driven engineering,<br /><span style={{ color: 'var(--accent)' }}>not just feature delivery</span>
            </motion.h1>
            <motion.p className="section-desc" variants={fadeUp(0.1)}>
              Each project framed as a system challenge — what broke, what I built, and what moved.
              Hover over the pipeline diagrams to explore data flow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CASE STUDIES */}
      {studies.map((s, i) => (
        <section key={s.id} className="cs-section" style={{ background: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}>
          <div className="container">
            <motion.div className="cs glass-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
              {/* Header */}
              <div className="cs__header">
                <span className="tag" style={{ marginBottom: 16, color: s.tagColor, borderColor: s.tagColor + '22', background: s.tagColor + '10' }}>{s.tag}</span>
                <h2 className="cs__title">{s.title}</h2>
                <p className="cs__brief">{s.brief}</p>
                <button className="cs__toggle" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                  {expandedId === s.id ? 'Collapse' : 'Expand Full Study'}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expandedId === s.id ? 'rotate(180deg)' : '', transition: 'transform 0.3s' }}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Pipeline Canvas */}
              <div className="cs__pipeline">
                <span className="cs__pipeline-label">System Pipeline</span>
                <div className="cs__pipeline-canvas">
                  <PipelineCanvas pipeline={s.pipeline} />
                </div>
              </div>

              {/* Expandable */}
              <AnimatePresence initial={false}>
                {expandedId === s.id && (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="cs__body">
                      <div className="cs__block">
                        <h3 className="cs__block-title"><span className="cs__block-num">01</span>The Problem</h3>
                        <p className="cs__block-text">{s.problem}</p>
                      </div>
                      <div className="cs__block">
                        <h3 className="cs__block-title"><span className="cs__block-num">02</span>Approach &amp; Decisions</h3>
                        <ul className="cs__steps">
                          {s.approach.map((step, si) => (
                            <motion.li key={si} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.05, duration: 0.3 }}>
                              <span className="cs__step-num">{String(si + 1).padStart(2, '0')}</span>{step}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div className="cs__block">
                        <h3 className="cs__block-title"><span className="cs__block-num">03</span>Measurable Results</h3>
                        <div className="cs__results">
                          {s.results.map((r, ri) => (
                            <ResultBar key={ri} val={r.val} label={r.label} desc={r.desc} color={r.color} delay={ri * 0.08} />
                          ))}
                        </div>
                      </div>
                      <div className="cs__block">
                        <h3 className="cs__block-title"><span className="cs__block-num">04</span>Stack</h3>
                        <div className="cs__tags">{s.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      ))}

      <style jsx global>{`
        .cs-section { padding: 80px 0; border-top: 1px solid var(--border); }
        .cs { overflow: hidden; }
        .cs__header { padding: 40px 40px 0; }
        .cs__title { font-size: clamp(24px, 3vw, 32px); font-weight: 700; color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 12px; }
        .cs__brief { font-size: 15px; color: var(--text-secondary); line-height: 1.7; max-width: 700px; margin-bottom: 24px; }
        .cs__toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--accent); padding: 8px 0; transition: opacity 120ms; }
        .cs__toggle:hover { opacity: 0.8; }
        .cs__pipeline { padding: 24px 40px 32px; }
        .cs__pipeline-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .cs__pipeline-canvas { height: 140px; border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-elevated); border: 1px solid var(--border); }
        .cs__body { padding: 0 40px 40px; display: grid; gap: 36px; }
        .cs__block-title { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; }
        .cs__block-num { font-family: var(--font-mono); font-size: 11px; color: var(--accent); opacity: 0.5; }
        .cs__block-text { font-size: 14px; color: var(--text-secondary); line-height: 1.7; max-width: 680px; }
        .cs__steps { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .cs__steps li { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
        .cs__step-num { font-family: var(--font-mono); font-size: 11px; color: var(--accent); opacity: 0.4; flex-shrink: 0; margin-top: 2px; }
        .cs__results { display: flex; flex-direction: column; gap: 20px; max-width: 560px; }
        .cs__tags { display: flex; flex-wrap: wrap; gap: 8px; }

        .rb__head { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 8px; }
        .rb__val { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; min-width: 56px; font-variant-numeric: tabular-nums; }
        .rb__label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .rb__desc { display: block; font-size: 11px; color: var(--text-muted); line-height: 1.4; }
        .rb__track { height: 4px; background: rgba(255,255,255,0.03); border-radius: 2px; overflow: hidden; }
        .rb__fill { height: 100%; border-radius: 2px; transform-origin: left; }

        @media (max-width: 768px) {
          .cs__header, .cs__pipeline, .cs__body { padding-left: 20px; padding-right: 20px; }
          .cs__pipeline-canvas { height: 120px; }
        }
      `}</style>
    </motion.main>
  );
}
