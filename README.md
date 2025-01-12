[※日本語の説明は下にあります。 / The description in Japanese is provided below.](#notion-daily-note日本語)

# Notion Daily Note

Writes selected text from the editor to daily Notion pages.

## Features

- Writes editor-selected text to Notion pages
- Text can be written in three ways:
  - Convert Markdown to Notion headings, lists, tables, etc.
  - Write as plain text without formatting
  - Write as a code block based on the current editor language
- Notion pages are automatically created daily (pages are automatically added to a calendar view database by date)
- Timestamps can be written alongside text

## Usage

1. Select text in the editor and run one of these commands from the command palette:
   - `Write Selection to Notion (Markdown enabled)`
     - Writes selected text to a Notion page, converting Markdown to Notion headings, lists, tables, etc.
   - `Write Selection as Text to Notion`
     - Writes selected text to a Notion page as plain text
   - `Write Selection as Code Block to Notion`
     - Writes selected text to a Notion page as a code block
1. A dated Notion page is created and the text or code block is written
   - Text will be added to the same page until the date changes

## Configuration

### Notion Setup

#### Integration Setup (Getting API Key)

Create an "integration" on the Notion site to connect VS Code with Notion.

[Integrations | Notion](https://www.notion.so/profile/integrations)

The integration name can be anything you prefer (e.g., "VS Code")

> Tip: Don't close the page after creating the integration as you'll need to set up the "Internal Integration Secret" (API key) in the extension

#### Creating Database Page

1. Create any page in Notion (example page title: "Notes")
2. Add a "Calendar View" database to the created page
3. Display the created database in full screen
4. Select "Connect > Connections" from "..." in the top right and choose the previously created integration

> Tip: You'll also need to set the URL of the created database page in the extension. This URL can be obtained by selecting "Copy link" from "..." in the top right

### VS Code Settings

Configuration items for Notion Daily Note:

- `notion-daily-note.apiKey`
  - Set the Notion API key
- `notion-daily-note.databasePageUrl`
  - Specify the Database Page URL
- `notion-daily-note.dateColumnName`
  - Name of the date column
- `notion-daily-note.dateFormat`
  - Date format used for page titles
  - Format: https://date-fns.org/v4.1.0/docs/format
- `notion-daily-note.writeTimestamp`
  - Write timestamps alongside text
- `notion-daily-note.timestampColor`
  - Color of timestamps
- `notion-daily-note.timestampFormat`
  - Format of timestamps
  - Format: https://date-fns.org/v4.1.0/docs/format

---

# Notion Daily Note（日本語）

エディタの選択範囲のテキストを日付毎の Notion ページに書き込みます。

## 特徴

- エディタで選択したテキストを Notion ページに書き込みます。
- テキストは以下の３つの方法で書き込むことができます。
  - Markdown を Notion の見出しやリスト、テーブル等に変換して書き込む
  - 装飾のない単純なテキストとして書き込む
  - 開いているエディタの言語に応じたコードブロックとして書き込む
- 書き込む先の Notion ページは日付毎に自動作成されます。（カレンダービューのデータベースに日付毎のページが自動追加されます。）
- テキストと一緒にタイムスタンプを書き込むことができます。

## 使い方

1. エディタでテキストを選択してコマンドパレットから以下のコマンドを実行します。
   - `選択範囲をNotionに書き込む（Markdownが有効）`
     - エディタで選択したテキストを Notion ページに書き込みます。テキスト内の Markdown は Notion の見出しやリスト、テーブル等に変換されて書き込まれます。
   - `選択範囲をテキストでNotionに書き込む`
     - エディタで選択したテキストを Notion ページに書き込みます。
   - `選択範囲をコードブロックでNotionに書き込む`
     - エディタで選択したテキストをコードブロックで Notion ページに書き込みます。
1. 日付毎の Notion ページが作成され、テキストまたはコードブロックが書き込まれます。
   - 日付が変わるまでは同じページにテキストが追加されます。

## 設定

### Notion 側の設定

#### インテグレーションの設定（API キーの取得）

Notion のサイトで VS Code と Notion を連携させるために必要な「インテグレーション」を作成します。

[インテグレーション | Notion](https://www.notion.so/profile/integrations)

インテグレーションの名前は何でも構わないのでお好みで。（例：「VS Code」）

> Tip: 作成したインテグレーションの「内部インテグレーションシークレット」（API キー）を機能拡張に設定することになるので、インテグレーション作成後にページを閉じないようにしておいて下さい。

#### データベースページの作成

1. Notion で任意のページを作成します。（ページタイトルの例：「メモ」）
2. 作成したページにデータベース「カレンダービュー」を追加します。
3. 作成したデータベースをフルスクリーン表示します。
4. 右上の「…」から「コネクト > 接続先」を選択し、事前に作成したインテグレーションを選択します。

> Tip: 作成したデータベースページの URL も機能拡張に設定します。この URL は右上の「…」から「リンクをコピー」で取得できます。

### VS Code 側の設定

Notion Daily Note の設定項目です。

- `notion-daily-note.apiKey`
  - Notion の API キーを設定します。
- `notion-daily-note.databasePageUrl`
  - データベースページの URL を指定します。
- `notion-daily-note.dateColumnName`
  - 日付カラムの名前
- `notion-daily-note.dateFormat`
  - 日付のフォーマット。ページのタイトルに使用されます。
  - 書式： https://date-fns.org/v4.1.0/docs/format
- `notion-daily-note.writeTimestamp`
  - テキストと一緒にタイムスタンプを書き込みます。
- `notion-daily-note.timestampColor`
  - タイムスタンプの色。
- `notion-daily-note.timestampFormat`
  - タイムスタンプのフォーマット。
  - 書式： https://date-fns.org/v4.1.0/docs/format
