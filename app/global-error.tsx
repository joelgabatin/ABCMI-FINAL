'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'client',
        message: error.message || 'Unknown client error',
        details: {
          name: error.name,
          digest: error.digest,
          stack: error.stack,
        },
      }),
    }).catch(() => {})
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ color: '#666' }}>An unexpected error occurred. Our team has been notified.</p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#2EA8DF',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
