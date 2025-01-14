import * as vscode from 'vscode'
import { Client } from '@notionhq/client'
import {
  BlockObjectRequest,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { generateContent } from './content'
import { getLanguage } from './language'
import { CommandType } from '../extension'

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
 * @param commandType CommandType
 * @returns
 */
export const writeToNotion = async (commandType: CommandType) => {
  // 設定の取得
  const config = vscode.workspace.getConfiguration('notion-daily-note')
  const apiKey = config.get<string>('apiKey')
  const destinationPageType = config.get<'DatabasePage' | 'FixPage'>(
    'destinationPageType',
    'DatabasePage'
  )
  const databasePageUrl = config.get<string>('databasePageUrl')
  const fixPageUrl = config.get<string>('fixPageUrl')
  const dateColumnName = config.get<string>('dateColumnName', vscode.l10n.t('Date')) // 日付
  const dateFormat = config.get<string>('dateFormat', vscode.l10n.t('PPPP')) // yyyy/MM/dd(eee)
  const timestampFormat = config.get<string>('timestampFormat', vscode.l10n.t('PPPPpp')) // yyyy/MM/dd(eee) HH:mm:ss
  const writeTimestamp = config.get<boolean>('writeTimestamp', true)
  const timestampColor = config.get<ApiColor>('timestampColor', 'yellow_background')

  // console.log('config', { apiKey, databasePageUrl, dateFormat, timestampFormat, writeTimestamp, timestampColor })

  if (!apiKey || !databasePageUrl) {
    vscode.window.showErrorMessage(
      vscode.l10n.t('Notion API Key or Database Page URL is not configured.') // Notion API キーまたはデータベースページURLが設定されていません。
    )
    return
  }

  // アクティブなテキストエディタと選択範囲の取得
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showInformationMessage(vscode.l10n.t('No text editor is selected.')) // テキストエディタが選択されていません。
    return
  }

  const selection = editor.selection
  const selectedText = editor.document.getText(selection)

  if (!selectedText) {
    vscode.window.showInformationMessage(vscode.l10n.t('No text is selected.')) // テキストが選択されていません。
    return
  }

  try {
    // Notion クライアントの初期化
    const notion = new Client({ auth: apiKey })
    // console.log(notion);

    // 書き込み先のページ
    let destinationPage: PartialPageObjectResponse | PartialDatabaseObjectResponse | undefined =
      undefined
    let databaseId: string = ''
    switch (destinationPageType) {
      default:
      // データベースページ
      case 'DatabasePage':
        // データベースのIDを取得
        databaseId = new URL(databasePageUrl).pathname.split('/').pop() || ''
        if (!databaseId) {
          vscode.window.showErrorMessage(vscode.l10n.t('The database page URL is not set.')) // データベースページのURLが設定されていません。  // TODO: エラーメッセージをローカライズ
          return
        }
        // console.log({databaseId})
        // 今日の日付でページを検索または作成
        const searchResult = await notion.databases.query({
          database_id: databaseId,
          filter: {
            property: dateColumnName,
            type: 'date',
            date: { equals: format(new Date(), 'yyyy-MM-dd') },
          },
        })
        // console.log({databaseId, searchResult})
        destinationPage = searchResult.results[0]
        break
      // 固定ページ
      case 'FixPage':
        const fixPageId = fixPageUrl && new URL(fixPageUrl).pathname.split('/').pop()
        if (!fixPageId) {
          vscode.window.showErrorMessage(vscode.l10n.t('The fix page URL is not set.')) // 固定ページのURLが設定されていません。  // TODO: エラーメッセージをローカライズ
          return
        }
        // 固定ページの取得
        destinationPage = await notion.pages.retrieve({ page_id: fixPageId })
        if (!destinationPage) {
          vscode.window.showErrorMessage(vscode.l10n.t('Failed to get the fix page.')) // 固定ページの取得に失敗しました。  // TODO: エラーメッセージをローカライズ
          return
        }
        break
    }

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
    let pageTitle: string = 'unknown'
    switch (destinationPageType) {
      default:
      // データベースページ
      case 'DatabasePage':
        const today = format(new Date(), dateFormat, { locale: ja })
        pageTitle = today
        if (destinationPage) {
          // console.log('destinationPage', destinationPage)
          // 既存のページが見つかった場合
          pageId = destinationPage.id
          // ページに追記
          await notion.blocks.children.append({
            block_id: pageId,
            children,
          })
        } else {
          // 新規ページ作成
          pageTitle = today
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
        }
        break
      // 固定ページ
      case 'FixPage':
        if (!destinationPage) {
          throw new Error('Fix page is not found') // TODO: エラーメッセージをローカライズ
        }
        // console.log('destinationPage', destinationPage)
        pageId = destinationPage.id
        // ページのタイトルを設定
        const titleProperty = (destinationPage as PageObjectResponse).properties?.title
        if (titleProperty && titleProperty.type === 'title') {
          pageTitle = titleProperty.title[0]?.plain_text || ''
        } else {
          pageTitle = 'unknown'
        }
        // ページに追記
        await notion.blocks.children.append({
          block_id: pageId,
          children,
        })

        break
    }

    vscode.window.showInformationMessage(
      vscode.l10n.t('Text has been added to Notion page "{pageTitle}".', { pageTitle }) // テキストをNotionページ「{pageTitle}」に追加しました。
    )
  } catch (error) {
    console.error(vscode.l10n.t('An error occurred while syncing to Notion:'), error) // Notionへの同期中にエラーが発生しました：
    vscode.window.showErrorMessage(vscode.l10n.t('Failed to sync text to Notion.')) // Notionへのテキスト同期に失敗しました。
  }
}
