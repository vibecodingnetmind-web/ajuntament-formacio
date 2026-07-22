import { z } from 'zod';

const dniNieRegex = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/;

export const empadronamentSchema = z.object({
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
  data_naixement: z
    .string()
    .min(1, 'La data de naixement és obligatòria')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
      },
      { message: 'La data de naixement no és vàlida o és futura' }
    ),
  adreca: z
    .string()
    .min(1, 'L\'adreça és obligatòria')
    .max(300, 'L\'adreça no pot superar els 300 caràcters'),
  municipi: z
    .string()
    .min(1, 'El municipi és obligatori')
    .max(100, 'El municipi no pot superar els 100 caràcters'),
  telefon: z
    .string()
    .regex(/^(\+?\d{9,15})?$/, 'El telèfon ha de tenir entre 9 i 15 dígits')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('L\'email no té un format vàlid')
    .optional()
    .or(z.literal('')),
  observacions: z
    .string()
    .max(1000, 'Les observacions no poden superar els 1000 caràcters')
    .optional()
    .or(z.literal('')),
});

export type EmpadronamentFormData = z.infer<typeof empadronamentSchema>;
