-- 1. profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. discovery_forms
CREATE TABLE discovery_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  directed_to TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  status TEXT NOT NULL DEFAULT 'pending',
  form_url TEXT GENERATED ALWAYS AS (
    'https://discovery.noctra.studio/f/' || slug
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 3. discovery_submissions
CREATE TABLE discovery_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES discovery_forms(id) ON DELETE CASCADE NOT NULL UNIQUE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  language TEXT NOT NULL DEFAULT 'es',
  q_what TEXT,
  q_why TEXT,
  q_adjectives TEXT,
  q_ideal_client TEXT,
  q_differentiator TEXT,
  q_perception_rank JSONB,
  q_visual_refs JSONB,
  q_accent_color TEXT,
  q_accent_color_name TEXT,
  q_visual_style JSONB,
  q_keep_elements TEXT,
  q_voice_attrs JSONB,
  q_tagline TEXT,
  q_tone_avoid TEXT,
  q_vision_5y TEXT,
  q_market_gap TEXT,
  q_never TEXT,
  pdf_url TEXT,
  email_sent_at TIMESTAMPTZ
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_submissions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- profiles: only the user themselves can read/edit their profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- discovery_forms: only creator can read/write their forms
CREATE POLICY "Users can view own discovery forms" ON discovery_forms
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own discovery forms" ON discovery_forms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own discovery forms" ON discovery_forms
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own discovery forms" ON discovery_forms
  FOR DELETE USING (auth.uid() = created_by);

-- discovery_forms (public check access): Anyone can view a form by slug
CREATE POLICY "Anyone can view discovery form by slug" ON discovery_forms
  FOR SELECT USING (true);

-- discovery_submissions: Public insert (no auth), Select only for parent form creator
CREATE POLICY "Anyone can insert submission" ON discovery_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Creators can view project submissions" ON discovery_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM discovery_forms
      WHERE discovery_forms.id = form_id
      AND discovery_forms.created_by = auth.uid()
    )
  );

-- TRIGGER FOR profiles AUTO-CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- STORAGE BUCKET: discovery-assets
INSERT INTO storage.buckets (id, name, public) VALUES ('discovery-assets', 'discovery-assets', true);

-- Storage Policies

-- Logos: public read, authenticated write
CREATE POLICY "Public read for logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'discovery-assets' AND (storage.foldername(name))[1] = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'discovery-assets' AND (storage.foldername(name))[1] = 'logos' AND auth.role() = 'authenticated');

-- PDFs: private read (only auth), write from service role (PostgREST won't block service role, but we secure the public endpoints)
CREATE POLICY "Authenticated users can read pdfs" ON storage.objects
  FOR SELECT USING (bucket_id = 'discovery-assets' AND (storage.foldername(name))[1] = 'pdfs' AND auth.role() = 'authenticated');

-- Note: Service role automatically bypasses RLS for insertion/update of PDFs.
