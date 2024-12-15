import * as vscode from 'vscode'
import { writeToNotion } from './main/writeToNotion'

/**
 * 機能拡張の有効化
 */
export const activate = (context: vscode.ExtensionContext) => {
  // コマンドの追加：選択範囲をNotionに書き込む
  context.subscriptions.push(
    vscode.commands.registerCommand('notion-daily-note.writeText', async () =>
      writeToNotion('text')
    )
  )
  // コマンドの追加：選択範囲をコードブロックとしてNotionに書き込む
  context.subscriptions.push(
    vscode.commands.registerCommand('notion-daily-note.writeCodeBlock', async () =>
      writeToNotion('codeBlock')
    )
  )
}

export const deactivate = () => {}
