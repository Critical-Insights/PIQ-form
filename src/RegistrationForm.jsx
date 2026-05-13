import React, { useState } from 'react';
import { FormCard } from './Page.jsx';
import {
  COUNTRIES, CATEGORIES, TIMEZONES,
  regionsFor, regionLabel, STATE_TIMEZONES,
} from './data.js';
import { formatTimezoneLabel } from './format.js';

const inputBase = {
  display: 'block',
  width: '100%',
  height: 42,
  padding: '0 12px',
  border: '1px solid #dfe4ec',
  borderRadius: 6,
  background: '#ffffff',
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#0f1d33',
  outline: 'none',
  transition: 'border-color 120ms, box-shadow 120ms',
  boxSizing: 'border-box',
};

function Label({ children, required, optional }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: '#0f1d33',
      marginBottom: 7,
      letterSpacing: '0.005em',
    }}>
      {children}
      {required && <span style={{ color: '#a8202b', marginLeft: 4 }}>*</span>}
      {optional && <span style={{ color: '#8794a8', fontWeight: 400, marginLeft: 6 }}>(optional)</span>}
    </label>
  );
}

function Field({ label, required, optional, children, hint, error, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <Label required={required} optional={optional}>{label}</Label>
      {children}
      {hint && !error && <div style={{ fontSize: 12, color: '#8794a8', marginTop: 6 }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: '#a8202b', marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function TextInput({ value, placeholder, onChange, type = 'text' }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        ...inputBase,
        borderColor: focus ? '#1a3c6e' : '#dfe4ec',
        boxShadow: focus ? '0 0 0 3px rgba(26, 60, 110, 0.18)' : 'none',
      }}
    />
  );
}

function Select({ value, onChange, options, placeholder, disabled }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          ...inputBase,
          appearance: 'none',
          paddingRight: 36,
          color: value ? '#0f1d33' : '#8794a8',
          background: disabled ? '#f5f6f8' : '#ffffff',
          borderColor: focus ? '#1a3c6e' : '#dfe4ec',
          boxShadow: focus ? '0 0 0 3px rgba(26, 60, 110, 0.18)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <svg
        width="12" height="12" viewBox="0 0 12 12"
        style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
          color: disabled ? '#aab3c2' : '#5a6b82',
        }}
      >
        <path d="M2 4.5 L6 8.5 L10 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SessionCard({ session, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(session.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '16px 18px',
        border: selected ? '1px solid #1a3c6e' : '1px solid #dfe4ec',
        borderLeftWidth: selected ? 4 : 1,
        borderLeftColor: selected ? '#1a3c6e' : '#dfe4ec',
        borderRadius: 6,
        background: selected ? 'rgba(26, 60, 110, 0.04)' : (hover ? '#fafaf7' : '#ffffff'),
        cursor: 'pointer',
        transition: 'all 120ms',
        fontFamily: 'inherit',
        marginBottom: 10,
        position: 'relative',
        paddingLeft: selected ? 15 : 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: selected ? '1px solid #1a3c6e' : '1px solid #c5cdda',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2,
          flexShrink: 0,
          transition: 'all 120ms',
        }}>
          {selected && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#1a3c6e' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: 17,
            fontWeight: 500,
            color: '#0f1d33',
            letterSpacing: '-0.005em',
            marginBottom: 4,
          }}>
            {session.dateLong}
          </div>
          <div style={{ fontSize: 14, color: '#0f1d33', marginBottom: 2 }}>
            {session.localTimeRange}
            <span style={{ color: '#8794a8', marginLeft: 8, fontSize: 13 }}>· your time</span>
          </div>
          <div style={{ fontSize: 12, color: '#8794a8' }}>
            Host time zone: {session.hostTimezone}
          </div>
        </div>
      </div>
    </button>
  );
}

function SessionPicker({ state, sessions, selectedId, onSelect }) {
  if (state === 'loading') {
    return (
      <div style={{
        border: '1px dashed #dfe4ec',
        borderRadius: 6,
        padding: '22px 18px',
        fontSize: 14,
        color: '#5a6b82',
        background: '#fbfaf6',
      }}>
        Loading available sessions…
      </div>
    );
  }
  if (state === 'empty' || !sessions || sessions.length === 0) {
    return (
      <div style={{
        border: '1px dashed #dfe4ec',
        borderRadius: 6,
        padding: '22px 18px',
        fontSize: 14,
        color: '#5a6b82',
        background: '#fbfaf6',
      }}>
        No upcoming sessions available right now. Please check back soon.
      </div>
    );
  }
  return (
    <div>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} selected={selectedId === s.id} onSelect={onSelect} />
      ))}
    </div>
  );
}

function SubmitButton({ disabled, busy, onClick, label = 'Register', busyLabel = 'Registering…' }) {
  const [hover, setHover] = useState(false);
  const isDisabled = disabled || busy;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 44,
        padding: '0 26px',
        border: 'none',
        borderRadius: 6,
        background: isDisabled ? '#9aa6b8' : (hover ? '#14315c' : '#1a3c6e'),
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background 120ms',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {busy ? busyLabel : label}
      {!busy && (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 7 H11 M7.5 3.5 L11 7 L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export function RegistrationForm({
  formState,
  onChange,
  sessionState,
  sessions,
  onSubmit,
  errors = {},
  submitting,
  formError,
}) {
  const tz = formState.timezone
    || (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone)
    || 'America/Los_Angeles';
  const canSubmit = !submitting
    && sessionState === 'loaded'
    && !!formState.sessionId;

  const set = (k) => (v) => onChange({ ...formState, [k]: v });

  return (
    <FormCard>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '20px 24px',
      }}>
        <Field label="Full name" required error={errors.fullName}>
          <TextInput value={formState.fullName} onChange={set('fullName')} />
        </Field>
        <Field label="Title / role" required error={errors.role}>
          <TextInput value={formState.role} onChange={set('role')} placeholder="e.g. Your Role" />
        </Field>
        <Field label="Organization" required error={errors.institution}>
          <TextInput value={formState.institution} onChange={set('institution')} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput value={formState.email} onChange={set('email')} type="email" placeholder="name@example.com" />
        </Field>
        <Field label="Country" required error={errors.country}>
          <Select
            value={formState.country}
            onChange={(v) => onChange({ ...formState, country: v, region: '' })}
            placeholder="Select country"
            options={COUNTRIES}
          />
        </Field>
        <Field label={regionLabel(formState.country)} required error={errors.region}>
          <Select
            value={formState.region}
            onChange={(v) => onChange({
              ...formState,
              region: v,
              timezone: STATE_TIMEZONES[v] || formState.timezone,
            })}
            placeholder={formState.country ? `Select ${regionLabel(formState.country).toLowerCase()}` : 'Select country first'}
            options={regionsFor(formState.country)}
            disabled={!formState.country}
          />
        </Field>
        <Field label="Category" optional full>
          <Select
            value={formState.specialty}
            onChange={set('specialty')}
            placeholder="Select if applicable"
            options={CATEGORIES}
          />
        </Field>
        <Field label="Time zone" required full hint={`Auto-detected: ${formatTimezoneLabel(tz)}`}>
          <Select
            value={tz}
            onChange={set('timezone')}
            options={(TIMEZONES.includes(tz) ? TIMEZONES : [tz, ...TIMEZONES]).map((z) => ({
              value: z,
              label: formatTimezoneLabel(z),
            }))}
          />
        </Field>
      </div>

      <div style={{ height: 1, background: '#eef1f6', margin: '28px 0 22px' }} />

      <div>
        <Label required>Choose a session</Label>
        <SessionPicker
          state={sessionState}
          sessions={sessions}
          selectedId={formState.sessionId}
          onSelect={(id) => onChange({ ...formState, sessionId: id })}
        />
        {errors.sessionId && (
          <div style={{ fontSize: 12, color: '#a8202b', marginTop: 4 }}>{errors.sessionId}</div>
        )}
      </div>

      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18 }}>
        <SubmitButton
          disabled={!canSubmit}
          busy={submitting}
          onClick={onSubmit}
        />
        {formError && <div style={{ fontSize: 13, color: '#a8202b' }}>{formError}</div>}
        {!formError && (
          <div style={{ fontSize: 12, color: '#8794a8' }}>
            By registering you agree to receive a calendar invite and follow-up email.
          </div>
        )}
      </div>
    </FormCard>
  );
}
