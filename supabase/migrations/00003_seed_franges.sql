-- Seed: franges disponibles per als propers 30 dies laborables
-- Dades fictícies per a entorn de formació

INSERT INTO franges_disponibles (data, hora_inici, hora_fi, capacitat, ocupades)
SELECT
  d.data,
  h.hora_inici,
  h.hora_fi,
  5,  -- capacitat
  0   -- ocupades inicial
FROM (
  SELECT generate_series(
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    INTERVAL '1 day'
  )::DATE AS data
) d
CROSS JOIN (
  VALUES
    ('09:00'::TIME, '10:00'::TIME),
    ('10:00'::TIME, '11:00'::TIME),
    ('11:00'::TIME, '12:00'::TIME),
    ('12:00'::TIME, '13:00'::TIME),
    ('16:00'::TIME, '17:00'::TIME),
    ('17:00'::TIME, '18:00'::TIME)
) AS h(hora_inici, hora_fi)
WHERE EXTRACT(DOW FROM d.data) BETWEEN 1 AND 5  -- dilluns a divendres
ON CONFLICT (data, hora_inici, hora_fi) DO NOTHING;
