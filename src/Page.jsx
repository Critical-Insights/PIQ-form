import React from 'react';

const pageStyles = {
  background: '#f7f6f2',
  color: '#0f1d33',
  fontFamily: '"Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif',
  fontFeatureSettings: '"ss01", "cv11"',
  minHeight: '100%',
  width: '100%',
  boxSizing: 'border-box',
  fontSize: 15,
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
};

export function LogoMark({ size = 40 }) {
  return (
    <img
      src="/assets/favicon.jpg"
      alt="Protocol IQ"
      width={size}
      height={size}
      style={{ display: 'block', borderRadius: 4 }}
    />
  );
}

function Header() {
  return (
    <header style={{ borderBottom: '1px solid #dfe4ec', background: '#ffffff' }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <LogoMark size={40} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: 22,
            fontWeight: 600,
            color: '#1a3c6e',
            letterSpacing: '-0.01em',
          }}>
            Protocol IQ
          </span>
          <span style={{ color: '#c5cdda' }}>|</span>
          <span style={{ fontSize: 13, color: '#5a6b82', letterSpacing: '0.01em' }}>
            Critical Insights Inc.
          </span>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 40px 32px' }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.16em',
        color: '#a8202b',
        textTransform: 'uppercase',
        marginBottom: 18,
      }}>
        Information Session
      </div>
      <h1 style={{
        fontFamily: '"Newsreader", Georgia, serif',
        fontSize: 44,
        lineHeight: 1.1,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        margin: '0 0 22px',
        color: '#0f1d33',
      }}>
        Register for a Protocol IQ session
      </h1>
      <p style={{
        fontSize: 16,
        lineHeight: 1.65,
        color: '#3a4a63',
        margin: 0,
        textWrap: 'pretty',
        maxWidth: 620,
      }}>
        Join a live walkthrough of Protocol IQ — our evidence-based protocol system. Pick the time that fits your schedule and we'll send a calendar invite.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #dfe4ec', marginTop: 64, background: '#ffffff' }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        color: '#8794a8',
      }}>
        <div>© 2026 Critical Insights Inc. All rights reserved.</div>
        <div>
          Questions?{' '}
          <a href="mailto:rchopra@criticalinsights.ai" style={{ color: '#5a6b82', textDecoration: 'none' }}>
            rchopra@criticalinsights.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

export function FormCard({ children }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 24px' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #dfe4ec',
        borderRadius: 8,
        padding: '32px 36px 30px',
        boxShadow: '0 1px 2px rgba(15, 29, 51, 0.04), 0 8px 24px -12px rgba(15, 29, 51, 0.10)',
      }}>
        {children}
      </div>
    </div>
  );
}

export function Page({ children }) {
  return (
    <div style={pageStyles}>
      <Header />
      <Hero />
      {children}
      <Footer />
    </div>
  );
}
