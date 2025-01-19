import * as vscode from 'vscode'
import { Client } from '@notionhq/client'
import {
  BlockObjectRequest,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { format } from 'date-fns'
import { getLocale } from './locale'
import { generateContent } from './content'
import { getLanguage } from './language'
import { CommandType } from '../extension'

/** 書き込み先ページタイプ */
type DestinationPageType = 'DatabasePage' | 'FixedPage' | 'SelectWhenWriting'

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
  const { l10n, window } = vscode
  const { t } = l10n
  const { activeTextEditor, showInformationMessage, showQuickPick, showErrorMessage } = window
  // 設定の取得
  const config = vscode.workspace.getConfiguration('notion-daily-note')
  const apiKey = config.get<string>('apiKey')
  const destinationPageTypeSetting = config.get<DestinationPageType>(
    'destinationPageType',
    'DatabasePage'
  )
  const databasePageUrl = config.get<string>('databasePageUrl')
  const fixedPageUrl = config.get<string>('fixedPageUrl')
  const dateColumnName = config.get<string>('dateColumnName', t('Date')) // 日付
  const dateFormat = config.get<string>('dateFormat', t('PPPP')) // yyyy/MM/dd(eee)
  const timestampFormat = config.get<string>('timestampFormat', t('PPPPpp')) // yyyy/MM/dd(eee) HH:mm:ss
  const writeTimestamp = config.get<boolean>('writeTimestamp', true)
  const timestampColor = config.get<ApiColor>('timestampColor', 'yellow_background')

  // console.log('config', { apiKey, databasePageUrl, dateFormat, timestampFormat, writeTimestamp, timestampColor })

  /* 設定のチェック */

  // APIキーの取得
  if (!apiKey) {
    // Notion API キーが設定されていません。
    showErrorMessage(t('Notion API Key is not configured.'))
    return
  }
  // データベースページのURL設定値チェック
  if (
    (destinationPageTypeSetting === 'SelectWhenWriting' ||
      destinationPageTypeSetting === 'DatabasePage') &&
    !databasePageUrl
  ) {
    // データベースページのURLが設定されていません。
    showErrorMessage(t('The database page URL is not set.'))
  }
  // 固定ページのURL設定値チェック
  if (
    (destinationPageTypeSetting === 'SelectWhenWriting' ||
      destinationPageTypeSetting === 'FixedPage') &&
    !fixedPageUrl
  ) {
    // 固定ページのURLが設定されていません。
    showErrorMessage(t('The fixed page URL is not set.'))
  }

  /* テキストの取得 */

  // アクティブなテキストエディタの取得
  const editor = activeTextEditor
  if (!editor) {
    // テキストエディタが選択されていません。
    showInformationMessage(t('No text editor is selected.'))
    return
  }
  // 選択されているテキストの取得
  const selectedText = editor.document.getText(editor.selection)
  if (!selectedText) {
    // テキストが選択されていません。
    showInformationMessage(t('No text is selected.'))
    return
  }

  /* 書き込み先の決定 */

  // 書き込み先
  let destinationPageType: DestinationPageType | undefined = destinationPageTypeSetting
  if (destinationPageType === 'SelectWhenWriting') {
    // 書き込み先の選択
    destinationPageType = await showQuickPick(
      [
        { label: t('Page by Date (Database Page)'), description: 'DatabasePage' },
        { label: t('Fixed page'), description: 'FixedPage' },
      ],
      {
        placeHolder: t('Please select the destination page.'),
        title: t('Notion Daily Note'),
      }
    ).then((selection) => selection?.description as DestinationPageType)

    if (!destinationPageType) {
      return
    }
  }

  /* Notion への書き込み */

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
        return
      // データベースページ
      case 'DatabasePage':
        // データベースのIDを取得
        databaseId = (databasePageUrl && new URL(databasePageUrl).pathname.split('/').pop()) || ''
        if (!databaseId) {
          // データベースIDの取得に失敗しました。データベースページのURLの設定を確認して下さい。
          showErrorMessage(
            t('Failed to get the database ID. Please check the database page URL settings.')
          )
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
      case 'FixedPage':
        const fixedPageId = (fixedPageUrl && new URL(fixedPageUrl).pathname.split('/').pop()) || ''
        if (!fixedPageId) {
          // 固定ページIDの取得に失敗しました。固定ページのURLの設定を確認して下さい。
          showErrorMessage(
            t('Failed to get the fixed page ID. Please check the fixed page URL settings.')
          )
          return
        }
        // 固定ページの取得
        destinationPage = await notion.pages.retrieve({ page_id: fixedPageId })
        if (!destinationPage) {
          // 固定ページの取得に失敗しました。
          showErrorMessage(t('Failed to get the fixed page.'))
          return
        }
        break
    }

    /* ページに書き込む内容の生成 */

    // ドキュメントの取得
    const document = activeTextEditor?.document
    // ページに書き込む内容
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

    /* ページへの書き込み */

    let pageId: string
    let pageTitle: string = 'unknown'
    switch (destinationPageType) {
      default:
        return
      // データベースページ
      case 'DatabasePage':
        // date-fnsのlocale（使用環境の言語から取得）
        const locale = getLocale(vscode.env.language)
        // ページタイトル（本日日付の文字列）
        pageTitle = format(new Date(), dateFormat, { locale })
        if (destinationPage) {
          // 既存のページが見つかった場合
          pageId = destinationPage.id
          // ページに追記
          await notion.blocks.children.append({
            block_id: pageId,
            children,
          })
        } else {
          // 新規ページ作成
          destinationPage = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
              title: {
                title: [{ type: 'text', text: { content: pageTitle } }],
              },
              [dateColumnName]: {
                type: 'date',
                date: { start: format(new Date(), 'yyyy-MM-dd') },
              },
            },
            children,
          })
        }
        break
      // 固定ページ
      case 'FixedPage':
        // console.log('destinationPage', destinationPage)
        pageId = destinationPage.id
        // ページのタイトルを設定
        const titleProperty = (destinationPage as PageObjectResponse).properties?.title
        if (titleProperty && titleProperty.type === 'title') {
          pageTitle = titleProperty.title[0]?.plain_text || ''
        }
        // ページに追記
        await notion.blocks.children.append({
          block_id: pageId,
          children,
        })
        break
    }

    /* 完了メッセージの表示 */

    // console.log(destinationPage)
    const pageUrl = (destinationPage as PageObjectResponse).url
    const openPageLabel = t('Open Notion Page')
    // テキストをNotionページ「{pageTitle}」に追加しました。
    showInformationMessage(
      t('Text has been added to Notion page "{pageTitle}".', { pageTitle }),
      openPageLabel
    ).then((selection) => {
      if (selection === openPageLabel) {
        vscode.env.openExternal(vscode.Uri.parse(pageUrl))
      }
    })
  } catch (error) {
    // Notionへの同期中にエラーが発生しました：
    console.error(t('An error occurred while syncing to Notion:'), error)
    // Notionへのテキスト同期に失敗しました。
    showErrorMessage(t('Failed to sync text to Notion.'))
  }
}
