[※日本語の説明は下にあります。 / The description in Japanese is provided below.](#notion-daily-note日本語)

# Notion Daily Note

Writes the text selected in the editor to a Notion page. You can choose to write to a daily page by date or a fixed page.

## Features

- Writes the text selected in the editor to a Notion page.
- There are three ways to write text:
  - Convert the Markdown in the text to Notion headings, lists, tables, etc.
  - Write as simple text with no formatting
  - Write as a code block according to the language of the open editor
- You can choose the Notion page to which you want to write:
  - A daily page
  - A fixed page
- You can also include a timestamp along with the text.

> Tip: It is convenient to create multiple Notion pages for different workspaces.

## Usage

1. Select the text in the editor and run one of the following commands from the command palette:
   - "Write selected text to Notion (Markdown enabled)"
     - Writes the selected text in the editor to the Notion page, converting Markdown within the text into headings, lists, tables, etc.
   - "Write selected text to Notion as plain text"
     - Writes the selected text in the editor to the Notion page.
   - "Write selected text to Notion as a code block"
     - Writes the selected text in the editor to the Notion page as a code block.
1. The text or code block is written to the Notion page specified in the settings.
   - Each time you run a command, the text is appended to the page.

## Settings

### Notion Configuration

#### Setting up the Integration (Obtaining an API Key)

Obtain the necessary “integration” (and its API key) to link VS Code with Notion by creating it from the Notion website.

1. Open the Notion integration management page:
   - [Integrations | Notion](https://www.notion.so/profile/integrations)
2. Create a new integration.
   - Any integration name can be used (e.g., “for VS Code”).
3. Copy the “Internal Integration Secret” (this is your API key).

Set this API key in the `notion-daily-note.apiKey` setting of VS Code.

#### Writing text to a daily page

Create a database page to write text to, configure your integration, and obtain the page URL.

1. Create any page in Notion (example title: “Daily Notes”).
2. Add a database with a calendar view to this new page.
3. Expand the database to full-screen.
4. Under “...”, select “Connect > Connections” and choose the integration you set up.
5. Under “...”, select “Copy link” to copy the page URL.

Set this URL in the `notion-daily-note.databasePageUrl` setting of VS Code.

#### Writing text to a fixed page

Create the page you want to write to, configure your integration, and get that page’s URL.

1. Create any page in Notion (example title: “Notes”).
2. Under “...”, select “Connect > Connections” and pick the integration you previously created.
3. Under “...”, select “Copy link” to copy the page URL.

Set this URL in the `notion-daily-note.fixedPageUrl` setting of VS Code.

### VS Code Configuration

The following settings belong to Notion Daily Note:

- `notion-daily-note.apiKey`
  - Notion API key
- `notion-daily-note.destinationPageType`
  - Where to write the text
  - Set it to “Daily Page (database page)” if you want to write text to a daily page, “Fixed Page” if the same page is always used, or “Select on Write” to choose each time.
- `notion-daily-note.databasePageUrl`
  - The URL of your database page
  - Required if “Daily Page” or “Select on Write” is selected
- `notion-daily-note.fixedPageUrl`
  - The URL of your fixed page
  - Required if “Fixed Page” or “Select on Write” is selected
- `notion-daily-note.dateColumnName`
  - The name of the date column
  - Used only if “Daily Page” is selected
- `notion-daily-note.dateFormat`
  - The date format used for the page title
  - Used only if “Daily Page” is selected
  - Format reference: <https://date-fns.org/v4.1.0/docs/format>
- `notion-daily-note.writeTimestamp`
  - Write a timestamp together with the text
- `notion-daily-note.timestampColor`
  - Color for the timestamp
- `notion-daily-note.timestampFormat`
  - Timestamp format
  - Format reference: <https://date-fns.org/v4.1.0/docs/format>

---

# Notion Daily Note（日本語）

エディタの選択範囲のテキストを Notion ページに書き込みます。書き込み先は日付毎のページか固定ページを選択できます。

## 特徴

- エディタで選択したテキストを Notion ページに書き込みます。
- テキストは以下の３つの方法で書き込むことができます。
  - Markdown を Notion の見出しやリスト、テーブル等に変換して書き込む
  - 装飾のない単純なテキストとして書き込む
  - 開いているエディタの言語に応じたコードブロックとして書き込む
- 書き込み先の Notion ページは以下のどちらかを選択できます。
  - 日付毎のページ
  - 固定ページ
- テキストと一緒にタイムスタンプを書き込むことができます。

> Tip: 書き込み先の Notion ページを複数作ってワークスペース毎に設定すると便利です。

## 使い方

1. エディタでテキストを選択してコマンドパレットから以下のコマンドを実行します。
   - `選択範囲をNotionに書き込む（Markdownが有効）`
     - エディタで選択したテキストを Notion ページに書き込みます。テキスト内の Markdown は Notion の見出しやリスト、テーブル等に変換されて書き込まれます。
   - `選択範囲をテキストでNotionに書き込む`
     - エディタで選択したテキストを Notion ページに書き込みます。
   - `選択範囲をコードブロックでNotionに書き込む`
     - エディタで選択したテキストをコードブロックで Notion ページに書き込みます。
1. 設定で指定された Notion ページにテキストまたはコードブロックが書き込まれます。
   - コマンドを実行する度、テキストがページ内に追記されます。

## 設定

### Notion 側の設定

#### インテグレーションの設定（API キーの取得）

Notion のサイトで VS Code と Notion を連携させるために必要な「インテグレーション」を作成して API キーを取得します。

1. Notion のインテグレーション管理ページを開きます。
   - [インテグレーション | Notion](https://www.notion.so/profile/integrations)
2. 新しいインテグレーションを作成します。
   - インテグレーション名は何でも構わないのでお好みで。（例：「for VS Code」）
3. 「内部インテグレーションシークレット」（これが API キーです）をコピーします。

この API キーを VS Code の設定`notion-daily-note.apiKey`に設定します。

#### 日付毎のページにテキストを書き込む場合

書き込み先のデータベースページを作成してインテグレーションを設定、そのページの URL を取得します。

1. Notion で任意のページを作成します。（ページタイトルの例：「日別メモ」）
2. 作成したページにデータベース「カレンダービュー」を追加します。
3. 作成したデータベースをフルスクリーン表示します。
4. 右上の「…」から「コネクト > 接続先」を選択し、事前に作成したインテグレーションを選択します。
5. 右上の「…」から「リンクをコピー」でページの URL をコピーします。

この URL を VS Code の設定`notion-daily-note.databasePageUrl`に設定します。

#### 固定ページにテキストを書き込む場合

書き込み先のページを作成してインテグレーションを設定、そのページの URL を取得します。

1. Notion で任意のページを作成します。（ページタイトルの例：「メモ」）
2. 右上の「…」から「コネクト > 接続先」を選択し、事前に作成したインテグレーションを選択します。
3. 右上の「…」から「リンクをコピー」でページの URL をコピーします。

この URL を VS Code の設定`notion-daily-note.fixedPageUrl`に設定します。

### VS Code 側の設定

Notion Daily Note の設定項目です。

- `notion-daily-note.apiKey`
  - Notion の API キー
- `notion-daily-note.destinationPageType`
  - テキストの書き込み先
  - 日付毎のページにテキストを書き込む場合は「日付毎のページ」、常に同じページにテキストを書き込む場合は「固定ページ」、テキストを書き込む時にどちらか選択する場合は「書き込み時に選択する」を指定します。
- `notion-daily-note.databasePageUrl`
  - データベースページの URL
  - ※テキストの書き込み先が「日付毎のページ」「書き込み時に選択する」の場合は必須
- `notion-daily-note.fixedPageUrl`
  - 固定ページの URL
  - ※テキストの書き込み先が「固定ページ」「書き込み時に選択する」の場合は必須
- `notion-daily-note.dateColumnName`
  - 日付カラムの名前
  - ※この設定はテキストの書き込み先が「日付毎のページ」の場合に使用されます。
- `notion-daily-note.dateFormat`
  - 日付のフォーマット。ページのタイトルに使用されます。
  - ※この設定はテキストの書き込み先が「日付毎のページ」の場合に使用されます。
  - 書式： <https://date-fns.org/v4.1.0/docs/format>
- `notion-daily-note.writeTimestamp`
  - テキストと一緒にタイムスタンプを書き込みます。
- `notion-daily-note.timestampColor`
  - タイムスタンプの色。
- `notion-daily-note.timestampFormat`
  - タイムスタンプのフォーマット。
  - 書式： <https://date-fns.org/v4.1.0/docs/format>
