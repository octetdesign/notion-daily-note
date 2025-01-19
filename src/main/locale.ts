import {
  enUS,
  zhCN,
  zhTW,
  fr,
  de,
  it,
  es,
  ja,
  ko,
  ru,
  ptBR,
  tr,
  pl,
  cs,
  hu,
  Locale,
} from 'date-fns/locale'

/** サポートするdate-fns localeのマッピング */
const localeMap: Record<string, Locale> = {
  en: enUS, //	English (US)
  'zh-cn': zhCN, //	Simplified Chinese
  'zh-tw': zhTW, //	Traditional Chinese
  fr, //	French
  de, //	German
  it, //	Italian
  es, //	Spanish
  ja, //	Japanese
  ko, //	Korean
  ru, //	Russian
  'pt-br': ptBR, //	Portuguese (Brazil)
  tr, //	Turkish
  pl, //	Polish
  cs, //	Czech
  hu, //	Hungarian
}

/** date-fns localeの取得 */
export const getLocale = (language: string) => {
  // TODO: できれば動的インポートにしたい
  return localeMap[language] || enUS
}
