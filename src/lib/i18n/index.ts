// TODO: Configurar i18n per suportar múltiples idiomes
// Estructura preparada per afegir:
// - ca (català) - actual
// - es (castellà)
// - en (anglès)
// - oc_aran (aranès)

export type SupportedLocale = 'ca';

export const defaultLocale: SupportedLocale = 'ca';

export const locales: SupportedLocale[] = ['ca'];

// TODO: Implementar amb next-intl, react-i18next o similar
export function useTranslation() {
  return {
    t: (key: string) => key, // Placeholder: retorna la clau
    locale: defaultLocale,
  };
}
