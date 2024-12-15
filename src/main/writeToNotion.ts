import * as vscode from 'vscode'
import { Client } from '@notionhq/client'
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { generateContent } from './content'
import { getLanguage } from './language'

/**
 * ブロックの色
 * NOTE: 右記から転記 node_modules/@notionhq/client/build/src/api-endpoints.d.ts
 * */
export type ApiColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background'

/**
 * 選択範囲のテキストをNotionに書き込む
 *
 * @param commandType 'text' | 'codeBlock'
 * @returns
 */
export const writeToNotion = async (commandType: 'text' | 'codeBlock') => {
  // 設定の取得
  const config = vscode.workspace.getConfiguration('notion-daily-note')
  const apiKey = config.get<string>('apiKey')
  const databasePageUrl = config.get<string>('databasePageUrl')
  const dateFormat = config.get<string>('dateFormat', 'yyyy/MM/dd(eee)')
  const timestampFormat = config.get<string>('timestampFormat', 'yyyy/MM/dd(eee) HH:mm:ss')
  const writeTimestamp = config.get<boolean>('writeTimestamp', true)
  const timestampColor = config.get<ApiColor>('timestampColor', 'yellow_background')

  // console.log('config', { apiKey, databasePageUrl, dateFormat, timestampFormat, writeTimestamp, timestampColor })

  if (!apiKey || !databasePageUrl) {
    vscode.window.showErrorMessage(
      'NotionのAPI キーまたはデータベースページURLが設定されていません。'
    )
    return
  }

  // アクティブなテキストエディタと選択範囲の取得
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showInformationMessage('テキストエディタが選択されていません。')
    return
  }

  const selection = editor.selection
  const selectedText = editor.document.getText(selection)

  if (!selectedText) {
    vscode.window.showInformationMessage('テキストが選択されていません。')
    return
  }

  try {
    // Notion クライアントの初期化
    const notion = new Client({ auth: apiKey })
    // console.log(notion);

    // データベースのIDを取得
    const databaseId = new URL(databasePageUrl).pathname.split('/').pop() || ''
    // console.log({databaseId})

    // 今日の日付でページを検索または作成
    const searchResult = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: '日付',
        type: 'date',
        date: { equals: format(new Date(), 'yyyy-MM-dd') },
      },
    })
    // console.log({databaseId, searchResult})
    const datePage = searchResult.results[0]

    // ページに書き込む内容
    const document = vscode.window.activeTextEditor?.document
    const children: BlockObjectRequest[] = generateContent({
      dateFormat,
      timestampFormat,
      timestampColor,
      text: selectedText,
      language: getLanguage(document?.languageId),
      fileName: document?.fileName,
      writeTimestamp,
      commandType,
    })

    let pageId: string
    const today = format(new Date(), dateFormat, { locale: ja })
    const pageTitle = today
    if (datePage) {
      // 既存のページが見つかった場合
      pageId = datePage.id

      // ページに追記
      await notion.blocks.children.append({
        block_id: pageId,
        children,
      })
    } else {
      // 新規ページ作成
      const newPage = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [{ type: 'text', text: { content: pageTitle } }],
          },
          日付: {
            type: 'date',
            date: { start: format(new Date(), 'yyyy-MM-dd') },
          },
        },
        children,
      })
      pageId = newPage.id
    }

    vscode.window.showInformationMessage(`テキストをNotionページ「${pageTitle}」に追加しました。`)
  } catch (error) {
    console.error('Notionへの同期中にエラーが発生しました:', error)
    vscode.window.showErrorMessage('Notionへのテキスト同期に失敗しました。')
  }
}
