import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints'

/**
 * 書き込むコンテンツを生成する
 * @param props
 * @returns
 */
export const generateContent = (props: {
  dateFormat: string
  dateTimeFormat: string
  text: string
  commandType?: 'text' | 'codeBlock'
  language?: string
  fileName?: string
  writeDateTime?: boolean
}) => {
  const children: BlockObjectRequest[] = []

  // 日時
  if (props.writeDateTime) {
    const datetime: BlockObjectRequest = {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `${format(new Date(), props.dateTimeFormat, { locale: ja })}`,
            },
          },
        ],
        color: 'yellow_background',
      },
    }
    children.push(datetime)
  }

  // コンテンツ
  children.push(generateBlock(props))

  return children
}

/**
 * ブロックを生成する
 * @param param0
 * @returns
 */
const generateBlock = (props: {
  dateFormat: string
  dateTimeFormat: string
  text: string
  language?: string
  fileName?: string
  commandType?: 'text' | 'codeBlock'
}) => {
  let type = 'default'

  // commandType='codeBlock'であればコードブロック
  if (props.commandType === 'codeBlock') {
    type = 'code'
  }
  // テキストがURLならブックマーク
  else if (props.text.match(/^http[s]?:\/\/[^\s]+$/)) {
    type = 'bookmark'
  }

  return generators[type](props)
}

/**
 * ブロックのジェネレータ
 */
const generators: {
  [type: string]: (props: {
    text: string
    language?: string
    fileName?: string
  }) => BlockObjectRequest
} = {
  /** デフォルト */
  default: ({ text }) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: text },
        },
      ],
    },
  }),

  /** ブックマーク */
  bookmark: ({ text }) => ({
    object: 'block',
    type: 'bookmark',
    bookmark: {
      url: text,
    },
  }),

  /** コードブロック */
  code: ({ text, language, fileName }) => ({
    object: 'block',
    type: 'code',
    code: {
      caption: fileName
        ? [
            {
              type: 'text',
              text: {
                content: fileName,
              },
            },
          ]
        : [],
      rich_text: [
        {
          type: 'text',
          text: {
            content: text.replace(/^\n+/, '').replace(/\n+$/, ''),
          },
        },
      ],
      language: (language ? language : '') as any,
    },
  }),
}
