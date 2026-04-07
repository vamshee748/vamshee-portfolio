import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Case Studies' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [router.route]);

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav__inner container">
          <Link href="/" className="nav__logo">
            <motion.span
              className="nav__logo-mark"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              ◆
            </motion.span>
            <span className="nav__logo-text">Vamshee</span>
          </Link>

          <div className="nav__links">
            {navLinks.map((link) => {
              const active = router.pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`nav__link ${active ? 'nav__link--active' : ''}`}>
                  {link.label}
                  {active && (
                    <motion.span
                      className="nav__indicator"
                      layoutId="nav-ind"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="nav__right">
            <a href="mailto:vamshee748@gmail.com" className="nav__cta">
              <span className="nav__cta-dot" />
              Let&apos;s Talk
            </a>

            <button
              className={`nav__burger ${mobileOpen ? 'nav__burger--open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="nav-mobile__links">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link href={link.href} className="nav-mobile__link">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          transition: all 300ms var(--ease-out-expo);
        }
        .nav--scrolled {
          background: var(--bg-glass-strong);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border-glass);
        }
        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .nav__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: -0.02em;
        }
        .nav__logo-mark {
          color: var(--accent);
          font-size: 12px;
          display: inline-block;
        }
        .nav__logo-text { color: var(--text-primary); }
        .nav__links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav__link {
          position: relative;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 450;
          color: var(--text-tertiary);
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
        }
        .nav__link:hover { color: var(--text-primary); }
        .nav__link--active { color: var(--text-primary); }
        .nav__indicator {
          position: absolute;
          bottom: 4px;
          left: 16px; right: 16px;
          height: 1.5px;
          background: var(--accent);
          border-radius: 1px;
          box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.4);
        }
        .nav__right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
          letter-spacing: 0.01em;
        }
        .nav__cta:hover {
          border-color: var(--border-active);
          box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.12);
        }
        .nav__cta-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
        }
        .nav__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
        }
        .nav__burger span {
          display: block;
          width: 18px; height: 1.5px;
          background: var(--text-primary);
          transition: all 200ms;
          transform-origin: center;
        }
        .nav__burger--open span:first-child { transform: rotate(45deg) translate(2px, 2px); }
        .nav__burger--open span:last-child { transform: rotate(-45deg) translate(2px, -2px); }

        .nav-mobile {
          position: fixed;
          inset: 0;
          top: var(--nav-height);
          z-index: 99;
          background: rgba(5,5,7,0.97);
          backdrop-filter: blur(24px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-mobile__links {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }
        .nav-mobile__link {
          font-size: 28px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        @media (max-width: 768px) {
          .nav__links { display: none; }
          .nav__cta { display: none; }
          .nav__burger { display: flex; }
        }
      `}</style>
    </>
  );
}
