import { z } from 'zod';
import { MOTIUS_CITA } from '@/lib/constants/cita';

const dniNieRegex = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/;

export const citaSchema = z.object({
  nom: z
    .string()
    .min(1, 'El nom és obligatori')
    .max(100, 'El nom no pot superar els 100 caràcters'),
  cognoms: z
    .string()
    .min(1, 'Els cognoms són obligatoris')
    .max(200, 'Els cognoms no poden superar els 200 caràcters'),
  dni_nie: z
    .string()
    .min(1, 'El DNI/NIE és obligatori')
    .regex(dniNieRegex, 'El DNI/NIE no té un format vàlid (ex. 12345678A o X1234567B)'),
  telefon: z
    .string()
    .min(9, 'El telèfon ha de tenir almenys 9 dígits')
    .max(15, 'El telèfon no pot superar els 15 dígits')
    .regex(/^\+?\d+$/, 'El telèfon només pot contenir dígits i opcionalment + al principi'),
  email: z
    .string()
    .email('L\'email no té un format vàlid'),
  motiu: z
    .string()
    .refine((val) => (MOTIUS_CITA as readonly string[]).includes(val), {
      message: 'Selecciona un motiu de la llista',
    }),
  data_cita: z
    .string()
    .min(1, 'Selecciona una data per a la cita'),
  franja_id: z
    .string()
    .min(1, 'Selecciona una franja horària'),
  franja_horaria: z
    .string()
    .min(1, 'Selecciona una franja horària'),
});

export type CitaFormData = z.infer<typeof citaSchema>;
