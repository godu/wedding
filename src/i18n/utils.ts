
export type Language = keyof (typeof Languages);
const Languages = {
  fr: true,
  en: true,
  hy: true
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in Languages) return lang as Language;
  return 'fr';
}
