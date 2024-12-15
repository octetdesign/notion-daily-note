# Notion Daily Note

選択範囲のテキストを日付毎の Notion ページに書き込む Visual Studio Code の機能拡張です。

## 特徴

- テキストエディタで選択した文字を Notion ページに書き込みます。
- 書き込む先の Notion ページは日付毎に自動作成されます。（カレンダービューのデータベースに日付毎のページが自動作成される。）
- 書き込む内容の前に日時が挿入されます。

## 設定

### Notion 側の設定

#### インテグレーションの設定（API キーの取得）

Notion のサイトで VS Code と Notion を連携させるために必要な「インテグレーション」を作成します。

[インテグレーション | Notion](https://www.notion.so/profile/integrations)

インテグレーションの名前は何でも構わないのでお好みで。（例：「VS Code」）

> Tip: 作成したインテグレーションの「内部インテグレーションシークレット」（API キー）を機能拡張に設定することになるので、インテグレーション作成後にページを閉じないようにしておいて下さい。

#### データベースページの作成

1. Notion で任意のページを作成します。（ページのタイトル：メモ）
2. 作成したページにデータベース「カレンダービュー」を追加します。
3. 作成したデータベースをフルスクリーン表示します。
4. 右上の「…」から「コネクト > 接続先」を選択し、事前に作成したインテグレーションを選択します。

> Tip: 作成したデータベースページの URL も機能拡張に設定します。この URL は右上の「…」から「リンクをコピー」で取得できます。

### Visual Studio Code 側の設定

Notion Daily Note の設定項目です。

- `notion-daily-note.apiKey`: Notion の API キーを設定します。
- `notion-daily-note.databasePageUrl`: データベースページの URL を指定します。
- `notion-daily-note.writeDateTime`: テキストと一緒に日時を書き込みます。
- `notion-daily-note.dateFormat`: 日付のフォーマット。ページのタイトルに使用されます。 ※書式： https://date-fns.org/v4.1.0/docs/format
- `notion-daily-note.dateTimeFormat`: 日時のフォーマット。日時を書き込む際に使用されます。 ※書式： https://date-fns.org/v4.1.0/docs/format
