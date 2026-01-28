-- The Mosaic: color_claims table for 4,096 claimable shorthand hex colors

CREATE TABLE color_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hex3 TEXT NOT NULL UNIQUE,                    -- "f0a" (lowercase shorthand, no #)
  hex6 TEXT NOT NULL,                           -- "#FF00AA"
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_fingerprint TEXT,                       -- pre-auth fallback
  owner_display_name TEXT,
  custom_color_name TEXT,
  blurb TEXT CHECK (char_length(blurb) <= 280),
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER NOT NULL DEFAULT 1000,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  reserved_at TIMESTAMPTZ,
  reserved_until TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  personalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_color_claims_payment_status ON color_claims(payment_status);
CREATE INDEX idx_color_claims_claimed_at ON color_claims(claimed_at DESC) WHERE payment_status = 'completed';
CREATE INDEX idx_color_claims_fingerprint ON color_claims(owner_fingerprint);
CREATE INDEX idx_color_claims_reservation_expiry ON color_claims(reserved_until) WHERE payment_status = 'pending';

-- Enable RLS
ALTER TABLE color_claims ENABLE ROW LEVEL SECURITY;

-- Anyone can read claims
CREATE POLICY "color_claims_read" ON color_claims
  FOR SELECT USING (true);

-- Only service role can insert/update (API routes use service role)
CREATE POLICY "color_claims_insert" ON color_claims
  FOR INSERT WITH CHECK (true);

CREATE POLICY "color_claims_update" ON color_claims
  FOR UPDATE USING (true);

-- Function to clean up expired reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
  DELETE FROM color_claims
  WHERE payment_status = 'pending'
    AND reserved_until IS NOT NULL
    AND reserved_until < NOW();
END;
$$ LANGUAGE plpgsql;
