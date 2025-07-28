// app/onboarding/page.tsx
'use client';

import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();

  // A very simple component to show the session status
  if (status === 'loading') {
    return <h1>Loading session...</h1>;
  }

  // Render the session details once loaded
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '1.2rem' }}>
      <h1>Onboarding Page (Debug Mode)</h1>
      <hr />
      <h2>Session Status: {status}</h2>
      <h3>Is `isOnboardingComplete`: {String(session?.user?.isOnboardingComplete)}</h3>
      <hr />
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}