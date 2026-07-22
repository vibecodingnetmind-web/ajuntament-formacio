-- Correcció: les policies admin_all_* comprovaven auth.jwt() ->> 'role'
-- que sempre retorna 'authenticated' (el rol de BD). Cal mirar a
-- app_metadata per saber si l'usuari té el rol custom 'admin'.

DROP POLICY IF EXISTS admin_all_sollicituds ON sollicituds_padro;
DROP POLICY IF EXISTS admin_all_cites ON cites;
DROP POLICY IF EXISTS admin_all_franges ON franges_disponibles;

CREATE POLICY admin_all_sollicituds ON sollicituds_padro
  FOR ALL TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY admin_all_cites ON cites
  FOR ALL TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY admin_all_franges ON franges_disponibles
  FOR ALL TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
