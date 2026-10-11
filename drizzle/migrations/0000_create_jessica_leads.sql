CREATE TABLE public.jessica_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 10 AND 20),
  city TEXT NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  birth_date DATE NOT NULL CHECK (birth_date <= CURRENT_DATE),
  consent BOOLEAN NOT NULL CHECK (consent = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.jessica_leads TO anon, authenticated;
GRANT ALL ON public.jessica_leads TO service_role;

ALTER TABLE public.jessica_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit lead forms"
ON public.jessica_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consent = true
  AND char_length(name) BETWEEN 2 AND 100
  AND char_length(phone) BETWEEN 10 AND 20
  AND char_length(city) BETWEEN 2 AND 100
  AND birth_date <= CURRENT_DATE
);

CREATE INDEX jessica_leads_created_at_idx ON public.jessica_leads (created_at DESC);