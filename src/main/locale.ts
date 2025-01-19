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
const LocaleMap: Record<string, Locale> = {
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
  return LocaleMap[language] || enUS
}

/** 日付カラム名のマップ */
const DateColumnMap: { [language: string]: string } = {
  en: 'Date', //	English (US)
  'zh-cn': '日期', //	Simplified Chinese
  'zh-tw': '日期', //	Traditional Chinese
  fr: 'Date', //	French
  de: 'Datum', //	German
  it: 'Data', //	Italian
  es: 'Fecha', //	Spanish
  ja: '日付', //	Japanese
  ko: '날짜', //	Korean
  ru: 'Дата', //	Russian
  'pt-br': 'Data', //	Portuguese (Brazil)
  tr: 'Tarih', //	Turkish
  pl: 'Data', //	Polish
  cs: 'Datum', //	Czech
  hu: 'Dátum', //	Hungarian
}

/** 日付カラム名の取得 */
export const getDateColumnName = (language: string) => {
  return DateColumnMap[language] || 'Date'
}
