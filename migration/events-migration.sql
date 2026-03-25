-- Events table
CREATE TABLE IF NOT EXISTS events (
  id                  SERIAL PRIMARY KEY,
  title               TEXT NOT NULL,
  date                DATE NOT NULL,
  time                TEXT NOT NULL,
  end_time            TEXT,
  location            TEXT NOT NULL,
  category            TEXT NOT NULL DEFAULT 'general',
  description         TEXT,
  capacity            INTEGER,
  featured            BOOLEAN DEFAULT FALSE,
  status              TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
  open_registration   BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Event attendees (registrations from the public)
CREATE TABLE IF NOT EXISTS event_attendees (
  id            SERIAL PRIMARY KEY,
  event_id      INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  notes         TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);
