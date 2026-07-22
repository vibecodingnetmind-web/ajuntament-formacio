-- RPC per crear cita de manera atòmica
-- Inserta la cita i incrementa ocupades a la franja escollida

CREATE OR REPLACE FUNCTION crear_cita(
  p_nom TEXT,
  p_cognoms TEXT,
  p_dni_nie TEXT,
  p_motiu TEXT,
  p_data_cita DATE,
  p_franja_horaria TEXT,
  p_franja_id UUID,
  p_telefon TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cita_id UUID;
  v_franja franges_disponibles%ROWTYPE;
BEGIN
  SELECT * INTO v_franja
  FROM franges_disponibles
  WHERE id = p_franja_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La franja seleccionada no existeix';
  END IF;

  IF v_franja.ocupades >= v_franja.capacitat THEN
    RAISE EXCEPTION 'La franja seleccionada està completa';
  END IF;

  INSERT INTO cites (nom, cognoms, dni_nie, telefon, email, motiu, data_cita, franja_horaria, estat)
  VALUES (p_nom, p_cognoms, p_dni_nie, p_telefon, p_email, p_motiu, p_data_cita, p_franja_horaria, 'pendent')
  RETURNING id INTO v_cita_id;

  UPDATE franges_disponibles
  SET ocupades = ocupades + 1
  WHERE id = p_franja_id;

  RETURN json_build_object(
    'id', v_cita_id,
    'data_cita', p_data_cita,
    'franja_horaria', p_franja_horaria
  );
END;
$$;

-- Permís perquè anon pugui executar la funció
GRANT EXECUTE ON FUNCTION crear_cita TO anon;
