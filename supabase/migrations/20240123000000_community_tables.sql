-- HueGo Community Features Schema
-- Run this in Supabase SQL Editor

-- Main palettes table
CREATE TABLE published_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colors JSONB NOT NULL,
  hex_codes TEXT[] NOT NULL,
  color_count SMALLINT NOT NULL CHECK (color_count >= 2 AND color_count <= 10),
  title TEXT,
  harmony_type TEXT,
  mood_tags TEXT[],
  author_fingerprint TEXT,
  author_display_name TEXT,
  like_count INTEGER DEFAULT 0 NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_palettes_created_at ON published_palettes(created_at DESC);
CREATE INDEX idx_palettes_like_count ON published_palettes(like_count DESC);
CREATE INDEX idx_palettes_share_code ON published_palettes(share_code);
CREATE INDEX idx_palettes_hex_codes ON published_palettes USING GIN(hex_codes);

-- Likes table
CREATE TABLE palette_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palette_id UUID NOT NULL REFERENCES published_palettes(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_like UNIQUE(palette_id, fingerprint)
);

-- Trigger to update like_count
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE published_palettes SET like_count = like_count + 1 WHERE id = NEW.palette_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE published_palettes SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.palette_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_like_count
AFTER INSERT OR DELETE ON palette_likes
FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- Enable Row Level Security
ALTER TABLE published_palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE palette_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for published_palettes
-- Anyone can read public palettes
CREATE POLICY "Public palettes are viewable by everyone"
  ON published_palettes FOR SELECT
  USING (is_public = true);

-- Anyone can insert palettes (anonymous publishing)
CREATE POLICY "Anyone can publish palettes"
  ON published_palettes FOR INSERT
  WITH CHECK (true);

-- RLS Policies for palette_likes
-- Anyone can read likes
CREATE POLICY "Likes are viewable by everyone"
  ON palette_likes FOR SELECT
  USING (true);

-- Anyone can insert likes
CREATE POLICY "Anyone can like palettes"
  ON palette_likes FOR INSERT
  WITH CHECK (true);

-- Anyone can delete their own likes (by fingerprint)
CREATE POLICY "Users can unlike their own likes"
  ON palette_likes FOR DELETE
  USING (true);
