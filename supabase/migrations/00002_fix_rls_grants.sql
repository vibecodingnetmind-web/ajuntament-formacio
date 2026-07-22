-- Correcció: atorgar permisos de taula als rols anon i authenticated
-- Les polítiques RLS filtren, però cal GRANT per poder accedir a les taules

-- Rol anon: inserir a sollicituds_padro i cites, llegir franges_disponibles
GRANT INSERT ON public.sollicituds_padro TO anon;
GRANT INSERT ON public.cites TO anon;
GRANT SELECT ON public.franges_disponibles TO anon;

-- Política SELECT per a anon a sollicituds_padro (necessari per Prefer: return=representation)
CREATE POLICY public_select_own_sollicituds ON sollicituds_padro FOR SELECT TO anon USING (true);

-- Rol authenticated (admin): accés complet a les tres taules
GRANT ALL ON public.sollicituds_padro TO authenticated;
GRANT ALL ON public.cites TO authenticated;
GRANT ALL ON public.franges_disponibles TO authenticated;
