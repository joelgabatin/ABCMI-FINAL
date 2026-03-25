-- Weekly Reading Plan table
CREATE TABLE IF NOT EXISTS weekly_reading_plans (
  id          SERIAL PRIMARY KEY,
  week_start  DATE NOT NULL,  -- Always the Monday of the week (YYYY-MM-DD)
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  reading     TEXT NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (week_start, day_of_week)
);
