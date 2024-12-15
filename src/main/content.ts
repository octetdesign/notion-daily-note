import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints'
import { ApiColor } from './writeToNotion'

/**
 * 書き込むコンテンツを生成する
 * @param props
 * @returns
 */
export const generateContent = (props: {
  dateFormat: string
  timestampFormat: string
  text: string
  commandType?: 'text' | 'codeBlock'
  language?: string
  fileName?: string
  writeTimestamp?: boolean
  timestampColor?: ApiColor
}) => {
  const children: BlockObjectRequest[] = []

  // タイムスタンプ
  if (props.writeTimestamp) {
    const timestamp: BlockObjectRequest = {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `${format(new Date(), props.timestampFormat, { locale: ja })}`,
            },
          },
        ],
        color: props.timestampColor,
      },
    }
    children.push(timestamp)
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
