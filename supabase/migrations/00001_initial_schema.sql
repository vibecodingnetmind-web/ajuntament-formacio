-- NOTA: Aquest fitxer és per a un entorn de formació. Totes les dades són fictícies.
-- Migració inicial: Creació de les taules del sistema de padró i cites

-- Extensió per UUID (Supabase ja té pgcrypto preinstal·lat)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Taula: sollicituds_padro
-- Gestiona les sol·licituds d'empadronament ciutadanes
-- ============================================================
CREATE TABLE sollicituds_padro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estat TEXT NOT NULL DEFAULT 'pendent' CHECK (estat IN ('pendent', 'en_revisio', 'aprovat', 'rebutjat')),
  nom TEXT NOT NULL,
  cognoms TEXT NOT NULL,
  dni_nie TEXT NOT NULL,
  data_naixement DATE NOT NULL,
  adreca TEXT NOT NULL,
  municipi TEXT NOT NULL,
  telefon TEXT,
  email TEXT,
  observacions TEXT
);

-- ============================================================
-- Taula: cites
-- Gestiona les cites prèvies amb l'ajuntament
-- ============================================================
CREATE TABLE cites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estat TEXT NOT NULL DEFAULT 'pendent' CHECK (estat IN ('pendent', 'confirmada', 'cancel·lada', 'realitzada')),
  nom TEXT NOT NULL,
  cognoms TEXT NOT NULL,
  dni_nie TEXT NOT NULL,
  telefon TEXT,
  email TEXT,
  motiu TEXT NOT NULL,
  data_cita DATE NOT NULL,
  franja_horaria TEXT NOT NULL
);

-- ============================================================
-- Taula: franges_disponibles
-- Gestiona la disponibilitat horària per a les cites
-- ============================================================
CREATE TABLE franges_disponibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora_inici TIME NOT NULL,
  hora_fi TIME NOT NULL,
  capacitat INTEGER NOT NULL DEFAULT 1,
  ocupades INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT franges_disponibles_unique UNIQUE (data, hora_inici, hora_fi)
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE sollicituds_padro ENABLE ROW LEVEL SECURITY;
ALTER TABLE cites ENABLE ROW LEVEL SECURITY;
ALTER TABLE franges_disponibles ENABLE ROW LEVEL SECURITY;

-- Política: inserció pública (anon) permesa
CREATE POLICY "public_insert_sollicituds" ON sollicituds_padro
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "public_insert_cites" ON cites
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "public_select_franges" ON franges_disponibles
  FOR SELECT TO anon
  USING (true);

-- Política: select, update, delete només per a admins autenticats
-- Els rols admin es gestionaran a Supabase Auth
CREATE POLICY "admin_all_sollicituds" ON sollicituds_padro
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_all_cites" ON cites
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_all_franges" ON franges_disponibles
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
