import React from 'react';
import { FormCard } from './Page.jsx';

function DetailsRow({ label, value, last }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 16,
      padding: '8px 0',
      borderBottom: last ? 'none' : '1px solid #eef1f6',
      fontSize: 13,
    }}>
      <div style={{ color: '#8794a8', letterSpacing: '0.02em' }}>{label}</div>
      <div style={{ color: '#0f1d33', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export function Confirmation({ firstName, email, session, tz }) {
  return (
    <FormCard>
      <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
        <div style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'rgba(34, 130, 90, 0.10)',
          border: '1px solid rgba(34, 130, 90, 0.25)',
          margin: '0 auto 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M7 14.5 L12 19 L21 9.5" stroke="#22825a" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{
          fontFamily: '"Newsreader", Georgia, serif',
          fontSize: 32,
          lineHeight: 1.15,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          margin: '0 0 12px',
          color: '#14315c',
        }}>
          You're registered
        </h2>
        <p style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: '#3a4a63',
          maxWidth: 480,
          margin: '0 auto 24px',
          textWrap: 'pretty',
        }}>
          Thanks, {firstName}. We've sent a confirmation email to{' '}
          <span style={{ color: '#0f1d33', fontWeight: 500 }}>{email}</span> with your meeting link
          and a calendar invite.
        </p>
      </div>

      <div style={{
        background: '#fbfaf6',
        border: '1px solid #eef1f6',
        borderRadius: 6,
        padding: '18px 20px',
        margin: '4px 0 18px',
      }}>
        <DetailsRow label="Session" value={session.dateLong} />
        <DetailsRow label="Time" value={session.localTimeRange} />
        <DetailsRow label="Time zone" value={tz} />
        <DetailsRow label="Email" value={email} last />
      </div>

      <div style={{ fontSize: 12, color: '#8794a8', textAlign: 'center' }}>
        Didn't get the email? Check your spam folder.
      </div>
    </FormCard>
  );
}
