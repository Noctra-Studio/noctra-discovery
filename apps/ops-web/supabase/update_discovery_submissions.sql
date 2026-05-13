-- Migration to add strategic discovery form fields to `discovery_submissions`

ALTER TABLE discovery_submissions
  ADD COLUMN IF NOT EXISTS q_origin TEXT,
  ADD COLUMN IF NOT EXISTS q_previous_attempts TEXT,
  ADD COLUMN IF NOT EXISTS q_internal_obstacle TEXT,
  ADD COLUMN IF NOT EXISTS q_concrete_result_brand TEXT,
  ADD COLUMN IF NOT EXISTS web_goal TEXT,
  ADD COLUMN IF NOT EXISTS seo_goal TEXT;

-- Verify that the columns were added correctly
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'discovery_submissions';
