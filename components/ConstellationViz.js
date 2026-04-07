import { useRef, useEffect, useCallback } from 'react';

/* ─── CATEGORY PALETTE ─── */
const COLORS = {
  cloud:      { r: 129, g: 140, b: 248, hex: '#818cf8' },
  iac:        { r: 167, g: 139, b: 250, hex: '#a78bfa' },
  cicd:       { r: 34,  g: 211, b: 238, hex: '#22d3ee' },
  monitoring: { r: 52,  g: 211, b: 153, hex: '#34d399' },
  scripting:  { r: 251, g: 191, b: 36,  hex: '#fbbf24' },
  frontend:   { r: 244, g: 114, b: 182, hex: '#f472b6' },
  backend:    { r: 110, g: 231, b: 183, hex: '#6ee7b7' },
  data:       { r: 96,  g: 165, b: 250, hex: '#60a5fa' },
};

/* ─── NODE DEFINITIONS ─── */
const NODES = [
  // Cloud
  { id: 'azure',        x: 0.15, y: 0.20, label: 'Azure',           cat: 'cloud',      r: 22 },
  { id: 'azurevm',      x: 0.08, y: 0.32, label: 'Azure VMs',       cat: 'cloud',      r: 16 },
  { id: 'blob',         x: 0.22, y: 0.34, label: 'Blob Storage',    cat: 'cloud',      r: 16 },
  { id: 'functions',    x: 0.12, y: 0.46, label: 'Functions',       cat: 'cloud',      r: 15 },
  { id: 'servicebus',   x: 0.24, y: 0.48, label: 'Service Bus',     cat: 'cloud',      r: 14 },
  { id: 'entraid',      x: 0.06, y: 0.56, label: 'Entra ID',        cat: 'cloud',      r: 14 },
  // IaC / Architecture
  { id: 'microservices', x: 0.40, y: 0.15, label: 'Microservices',  cat: 'iac',        r: 20 },
  { id: 'rest',          x: 0.35, y: 0.28, label: 'REST APIs',      cat: 'iac',        r: 17 },
  { id: 'mvc',           x: 0.48, y: 0.28, label: 'MVC',            cat: 'iac',        r: 14 },
  { id: 'mvvm',          x: 0.52, y: 0.16, label: 'MVVM',           cat: 'iac',        r: 13 },
  // CI/CD
  { id: 'jenkins',      x: 0.68, y: 0.15, label: 'Jenkins',         cat: 'cicd',       r: 19 },
  { id: 'git',          x: 0.78, y: 0.22, label: 'Git',             cat: 'cicd',       r: 17 },
  { id: 'maven',        x: 0.72, y: 0.30, label: 'Maven',           cat: 'cicd',       r: 14 },
  { id: 'cicd',         x: 0.62, y: 0.26, label: 'CI/CD',           cat: 'cicd',       r: 16 },
  // Frontend
  { id: 'react',        x: 0.30, y: 0.62, label: 'React',           cat: 'frontend',   r: 22 },
  { id: 'angular',      x: 0.22, y: 0.74, label: 'Angular',         cat: 'frontend',   r: 17 },
  { id: 'js',           x: 0.38, y: 0.74, label: 'JavaScript',      cat: 'frontend',   r: 18 },
  { id: 'html',         x: 0.14, y: 0.82, label: 'HTML/CSS',        cat: 'frontend',   r: 15 },
  { id: 'bootstrap',    x: 0.30, y: 0.86, label: 'Bootstrap',       cat: 'frontend',   r: 13 },
  // Backend
  { id: 'java',         x: 0.58, y: 0.50, label: 'Java',            cat: 'backend',    r: 24 },
  { id: 'spring',       x: 0.68, y: 0.44, label: 'Spring Boot',     cat: 'backend',    r: 20 },
  { id: 'node',         x: 0.50, y: 0.60, label: 'Node.js',         cat: 'backend',    r: 17 },
  { id: 'dotnet',       x: 0.72, y: 0.56, label: '.NET',            cat: 'backend',    r: 16 },
  { id: 'django',       x: 0.62, y: 0.64, label: 'Django',          cat: 'backend',    r: 15 },
  { id: 'cpp',          x: 0.80, y: 0.46, label: 'C++',             cat: 'backend',    r: 14 },
  // Data
  { id: 'oracle',       x: 0.82, y: 0.68, label: 'Oracle',          cat: 'data',       r: 18 },
  { id: 'mysql',        x: 0.90, y: 0.58, label: 'MySQL',           cat: 'data',       r: 16 },
  { id: 'mongo',        x: 0.88, y: 0.76, label: 'MongoDB',         cat: 'data',       r: 17 },
  { id: 'plsql',        x: 0.78, y: 0.82, label: 'PL/SQL',          cat: 'data',       r: 14 },
  // Monitoring
  { id: 'monitor',      x: 0.46, y: 0.40, label: 'Azure Monitor',   cat: 'monitoring', r: 16 },
  { id: 'log4j',        x: 0.54, y: 0.36, label: 'Log4J',           cat: 'monitoring', r: 13 },
  // Messaging
  { id: 'rabbitmq',     x: 0.38, y: 0.48, label: 'RabbitMQ',        cat: 'scripting',  r: 15 },
  { id: 'activemq',     x: 0.44, y: 0.54, label: 'ActiveMQ',        cat: 'scripting',  r: 14 },
];

/* ─── CONNECTIONS ─── */
const CONNECTIONS = [
  // Cloud cluster
  ['azure','azurevm'], ['azure','blob'], ['azure','functions'], ['azure','servicebus'], ['azure','entraid'],
  ['functions','servicebus'], ['blob','functions'],
  // Architecture cluster
  ['microservices','rest'], ['microservices','mvc'], ['microservices','mvvm'], ['rest','mvc'],
  // CI/CD cluster
  ['jenkins','git'], ['jenkins','maven'], ['jenkins','cicd'], ['git','cicd'], ['maven','cicd'],
  // Frontend cluster
  ['react','angular'], ['react','js'], ['js','html'], ['js','bootstrap'], ['angular','html'],
  // Backend cluster
  ['java','spring'], ['java','node'], ['java','dotnet'], ['java','cpp'], ['spring','dotnet'],
  ['node','django'], ['spring','django'],
  // Data cluster
  ['oracle','mysql'], ['oracle','mongo'], ['oracle','plsql'], ['mysql','mongo'],
  // Monitoring
  ['monitor','log4j'],
  // Messaging
  ['rabbitmq','activemq'],
  // Cross-cluster bridges
  ['azure','jenkins'], ['azure','microservices'], ['microservices','java'], ['react','rest'],
  ['react','node'], ['spring','oracle'], ['java','oracle'], ['node','mongo'],
  ['functions','monitor'], ['cicd','spring'], ['monitor','spring'],
  ['servicebus','rabbitmq'], ['rabbitmq','node'], ['activemq','java'],
  ['js','node'], ['rest','spring'],
];

/* ─── PARTICLE SYSTEM ─── */
class Particle {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
    this.progress = Math.random();
    this.speed = 0.001 + Math.random() * 0.003;
    this.color = color;
    this.size = 1 + Math.random() * 1.5;
  }
  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.progress = 0;
  }
  getPos() {
    return {
      x: this.x1 + (this.x2 - this.x1) * this.progress,
      y: this.y1 + (this.y2 - this.y1) * this.progress,
    };
  }
}

export default function ConstellationViz({ style, className }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const nodesMapRef = useRef(new Map());

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const t = performance.now() * 0.001;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, W, H);

    /* Resolve pixel positions */
    const resolved = NODES.map(n => ({
      ...n,
      px: n.x * W,
      py: n.y * H,
      col: COLORS[n.cat],
    }));
    const nodeMap = new Map();
    resolved.forEach(n => nodeMap.set(n.id, n));
    nodesMapRef.current = nodeMap;

    /* ── Draw connections ── */
    CONNECTIONS.forEach(([aId, bId]) => {
      const a = nodeMap.get(aId);
      const b = nodeMap.get(bId);
      if (!a || !b) return;

      const midX = (a.px + b.px) / 2;
      const midY = (a.py + b.py) / 2;
      const distMouse = Math.hypot(mouse.x - midX, mouse.y - midY);
      const proximity = Math.max(0, 1 - distMouse / 200);

      const baseAlpha = 0.06 + proximity * 0.18;
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
      ctx.strokeStyle = `rgba(${a.col.r},${a.col.g},${a.col.b},${baseAlpha})`;
      ctx.lineWidth = 0.6 + proximity * 1.2;
      ctx.stroke();
    });

    /* ── Draw + update particles ── */
    particlesRef.current.forEach(p => {
      p.update();
      const pos = p.getPos();
      const distMouse = Math.hypot(mouse.x - pos.x, mouse.y - pos.y);
      const prox = Math.max(0, 1 - distMouse / 180);
      const alpha = 0.3 + prox * 0.6;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * (1 + prox * 0.8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
      ctx.fill();
    });

    /* ── Draw nodes ── */
    resolved.forEach(n => {
      const distMouse = Math.hypot(mouse.x - n.px, mouse.y - n.py);
      const proximity = Math.max(0, 1 - distMouse / 160);

      // Breathing
      const breath = Math.sin(t * 1.5 + n.px * 0.01) * 0.12 + 1;
      const scale = breath + proximity * 0.35;
      const drawR = n.r * scale;

      // Outer glow
      if (proximity > 0.1) {
        const grad = ctx.createRadialGradient(n.px, n.py, drawR * 0.5, n.px, n.py, drawR * 3);
        grad.addColorStop(0, `rgba(${n.col.r},${n.col.g},${n.col.b},${0.12 * proximity})`);
        grad.addColorStop(1, `rgba(${n.col.r},${n.col.g},${n.col.b},0)`);
        ctx.beginPath();
        ctx.arc(n.px, n.py, drawR * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Ring
      ctx.beginPath();
      ctx.arc(n.px, n.py, drawR + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.col.r},${n.col.g},${n.col.b},${0.08 + proximity * 0.15})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Core circle
      const coreGrad = ctx.createRadialGradient(n.px - drawR * 0.2, n.py - drawR * 0.2, 0, n.px, n.py, drawR);
      coreGrad.addColorStop(0, `rgba(${Math.min(255,n.col.r+40)},${Math.min(255,n.col.g+40)},${Math.min(255,n.col.b+40)},${0.7 + proximity * 0.3})`);
      coreGrad.addColorStop(1, `rgba(${n.col.r},${n.col.g},${n.col.b},${0.4 + proximity * 0.4})`);
      ctx.beginPath();
      ctx.arc(n.px, n.py, drawR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Label
      const labelAlpha = proximity > 0.25 ? 0.5 + proximity * 0.5 : 0.35;
      const fontSize = proximity > 0.25 ? 11 + proximity * 3 : 10;
      ctx.font = `500 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = `rgba(236,236,241,${labelAlpha})`;
      ctx.fillText(n.label, n.px, n.py + drawR + 8);
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Re-create particles when resizing */
      const particles = [];
      CONNECTIONS.forEach(([aId, bId]) => {
        const a = NODES.find(n => n.id === aId);
        const b = NODES.find(n => n.id === bId);
        if (!a || !b) return;
        const count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(
            a.x * rect.width, a.y * rect.height,
            b.x * rect.width, b.y * rect.height,
            COLORS[a.cat]
          ));
        }
      });
      particlesRef.current = particles;
    };

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
    />
  );
}

export { COLORS, NODES };
