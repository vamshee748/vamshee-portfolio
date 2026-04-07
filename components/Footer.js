export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">
              <span style={{ color: 'var(--accent)', fontSize: 12 }}>◆</span> Vamshee Bhatt
            </span>
            <p className="footer__tagline">Engineering measurable impact through thoughtful systems.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <span className="footer__col-title">Navigate</span>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/projects">Case Studies</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="footer__col">
              <span className="footer__col-title">Connect</span>
              <a href="mailto:vamshee748@gmail.com">Email</a>
              <a href="tel:+14704675480">Phone</a>
            </div>
          </div>
        </div>
        <div className="footer__line" />
        <div className="footer__bottom">
          <span className="footer__copy">&copy; {new Date().getFullYear()} Vamshee Bhatt</span>
          <span className="footer__status">
            <span className="footer__dot" /> Available for opportunities
          </span>
        </div>
      </div>
      <style jsx>{`
        .footer {
          border-top: 1px solid var(--border);
          padding: 56px 0 28px;
          background: var(--bg-void);
        }
        .footer__top {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          margin-bottom: 40px;
        }
        .footer__brand { max-width: 300px; }
        .footer__logo {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .footer__tagline {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .footer__links { display: flex; gap: 56px; }
        .footer__col { display: flex; flex-direction: column; gap: 8px; }
        .footer__col-title {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .footer__col a {
          font-size: 13px;
          color: var(--text-tertiary);
          transition: color var(--transition-fast);
        }
        .footer__col a:hover { color: var(--accent); }
        .footer__line { height: 1px; background: var(--border); margin-bottom: 20px; }
        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer__copy { font-size: 12px; color: var(--text-muted); }
        .footer__status {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer__dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.4);
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .footer__top { flex-direction: column; gap: 32px; }
          .footer__links { gap: 32px; }
          .footer__bottom { flex-direction: column; gap: 10px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
