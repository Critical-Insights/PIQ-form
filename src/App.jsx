import React, { useEffect, useState } from 'react';
import { Page } from './Page.jsx';
import { RegistrationForm } from './RegistrationForm.jsx';
import { Confirmation } from './Confirmation.jsx';
import { formatSessionForDisplay, viewerTimezone } from './format.js';
import { TZ_TO_COUNTRY_STATE } from './data.js';

const EMPTY_FORM = {
  fullName: '',
  role: '',
  institution: '',
  email: '',
  country: '',
  region: '',
  specialty: '',
  timezone: '',
  sessionId: null,
};

function initialForm() {
  const tz = viewerTimezone();
  const guess = TZ_TO_COUNTRY_STATE[tz];
  return {
    ...EMPTY_FORM,
    timezone: tz,
    country: guess ? guess.country : '',
    region: guess ? guess.state : '',
  };
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [sessions, setSessions] = useState([]);
  const [sessionState, setSessionState] = useState('loading');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = (data.sessions || []).map((s) => formatSessionForDisplay(s));
        setSessions(list);
        setSessionState(list.length === 0 ? 'empty' : 'loaded');
      })
      .catch(() => {
        if (cancelled) return;
        setSessions([]);
        setSessionState('empty');
      });
    return () => { cancelled = true; };
  }, []);

  const onSubmit = async () => {
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        fullName: form.fullName,
        role: form.role,
        institution: form.institution,
        email: form.email,
        country: form.country,
        region: form.region,
        specialty: form.specialty,
        timezone: form.timezone || viewerTimezone(),
        sessionId: form.sessionId,
      };
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setConfirmed(true);
      } else if (res.status === 409) {
        setFormError(data.error || 'This session is full. Please pick another time.');
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    const selected = sessions.find((s) => s.id === form.sessionId);
    const firstName = (form.fullName || 'there').split(' ')[0];
    const tz = form.timezone || viewerTimezone();
    return (
      <Page>
        <Confirmation
          firstName={firstName}
          email={form.email}
          session={selected || { dateLong: '', localTimeRange: '' }}
          tz={tz}
        />
      </Page>
    );
  }

  return (
    <Page>
      <RegistrationForm
        formState={form}
        onChange={setForm}
        sessionState={sessionState}
        sessions={sessions}
        onSubmit={onSubmit}
        submitting={submitting}
        formError={formError}
      />
    </Page>
  );
}
