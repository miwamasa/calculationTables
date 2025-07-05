# データベース駆動型スプレッドシートシステム

複数のテーブル間でデータと計算式を管理し、計算式をJSON形式で保存・再利用可能なスプレッドシートシステムです。

## 主な特徴

🔄 **リアルタイム計算**: セル値変更時の自動再計算と依存関係の管理  
📊 **JSON形式の数式**: 計算式をJSONオブジェクトとして保存・テンプレート化  
🔗 **テーブル間参照**: 複数のテーブル間でのデータ参照と計算  
⚡ **高性能**: Redisキャッシュによる高速計算とWebSocketリアルタイム更新  
🏗️ **スケーラブル**: MongoDB + Express + React + TypeScriptの堅牢な構成  
🎨 **モダンUI**: システム設計に基づいた直感的なユーザーインターフェース  
📈 **計算履歴**: 数式適用履歴の記録・トレース機能  
🎯 **視覚的表示**: 数式適用セルの視覚的識別と情報表示  
🖥️ **統合コンソール**: リアルタイム操作ログとエラー表示システム  

## 技術スタック

- **Backend**: Node.js, Express, MongoDB, Redis, Socket.IO
- **Frontend**: React, TypeScript, TanStack React Table
- **Infrastructure**: Docker, Docker Compose

## UI/UX設計

システムは.claude/systemdesign.mdの仕様に基づいて設計されており、以下のレイアウトを採用：

```
┌─────────────────────────────────────────────────┐
│  ツールバー（表選択・新規作成・設定）               │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  サイドバー  │        表ビュー                   │
│             │   （編集可能なグリッド）            │
│  ・表一覧    │                                   │
│  ・数式一覧  │                                   │
│  ・履歴     │                                   │
│             │                                   │
├─────────────┴───────────────────────────────────┤
│  数式エディタ（選択セルの数式を表示・編集）         │
└─────────────────────────────────────────────────┘
```

### 主要コンポーネント

- **Toolbar**: システム全体の操作ボタンと選択中テーブルの表示
- **Sidebar**: テーブル一覧、数式一覧、履歴の管理
- **TableGrid**: TanStack React Tableベースの編集可能なスプレッドシート
- **FormulaEditor**: 数式入力・編集用のエディタ（シンタックスハイライト対応）
- **CalculationHistory**: 数式適用履歴の表示・管理
- **Console**: ターミナル風のリアルタイム操作ログ表示

## クイックスタート

### 1. 前提条件
- Node.js 18以上
- Docker & Docker Compose
- Git

### 2. セットアップ

```bash
# リポジトリクローン
git clone <repository-url>
cd calculationTables

# 依存関係インストール
cd backend && npm install
cd ../frontend && npm install

# Dockerサービス起動
docker compose up -d mongodb redis

# バックエンド起動
cd backend && npm run dev

# フロントエンド起動（別ターミナル）
cd frontend && npm start
```

### 3. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001
- ヘルスチェック: http://localhost:3001/health

## 使用方法

### Webインターフェース使用
1. http://localhost:3000 にアクセス
2. ツールバーの「➕ 新規表」をクリックしてテーブル作成
3. サイドバーでテーブルを選択
4. グリッドでセル編集（ダブルクリックまたはF2キー）
5. 「🧮 数式エディタ」でセルに数式を追加

### 数式の作成と適用

#### 数式の作成方法
1. サイドバーの「数式一覧」セクションで「+ 新規」をクリック
2. 数式名と説明を入力
3. JSON形式で数式を定義（例: 単価×数量）
```json
{
  "type": "multiply",
  "operands": [
    {"type": "cell_reference", "column": "price"},
    {"type": "cell_reference", "column": "quantity"}
  ]
}
```
4. 「作成」ボタンで保存

#### 数式をセルに適用する方法
1. 表ビューで数式を適用したいセルをクリックして選択
2. ツールバーの「⚡ 数式適用」ボタンをクリック
3. 適用したい数式をドロップダウンから選択
4. 「✅ 適用」ボタンをクリック
5. 数式が計算されて結果が表示される
6. 数式が適用されたセルは緑色の背景と「f」アイコンで識別される

#### 計算履歴の確認
1. ツールバーの「📊 計算履歴」ボタンをクリック
2. 過去の数式適用履歴を時系列で確認
3. 各履歴にはセル位置、数式名、計算式、結果、適用日時が表示される
4. 数式が適用されたセルにマウスをホバーすると数式名が表示される

#### コンソール機能の活用
1. ツールバーの「🖥️ コンソール」ボタンでコンソール表示切り替え
2. 各種操作の結果がリアルタイムでコンソールに表示される
3. 成功（✅）、警告（⚠️）、エラー（❌）、情報（ℹ️）の4種類のメッセージ
4. 「クリア」ボタンでコンソールメッセージを全削除
5. コンソールは自動スクロールで最新メッセージを表示

#### 数式の編集・削除
- サイドバーの数式一覧で「編集」ボタンをクリックして修正
- 「削除」ボタンで不要な数式を削除

#### 対応する数式タイプ
- **add**: 加算（足し算）
- **subtract**: 減算（引き算）
- **multiply**: 乗算（掛け算）
- **divide**: 除算（割り算）
- **constant**: 定数値
- **cell_reference**: セル参照

### キーボードショートカット
- **F2**: 選択セルの数式編集モード
- **Tab**: 次のセルに移動
- **Enter**: 下のセルに移動
- **Esc**: 編集モードを終了

## API使用例

### テーブル作成
```bash
curl -X POST http://localhost:3001/api/tables \
  -H "Content-Type: application/json" \
  -d '{
    "name": "売上データ",
    "columns": [
      {"id": "product", "name": "商品名", "type": "string"},
      {"id": "price", "name": "単価", "type": "number"},
      {"id": "quantity", "name": "数量", "type": "number"},
      {"id": "total", "name": "合計", "type": "formula"}
    ]
  }'
```

### 計算式作成
```bash
curl -X POST http://localhost:3001/api/formulas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "売上計算",
    "expression": {
      "type": "multiply",
      "operands": [
        {"type": "cell_reference", "table": "current", "column": "price"},
        {"type": "cell_reference", "table": "current", "column": "quantity"}
      ]
    }
  }'
```

### 対応する計算式の例

**基本四則演算**:
```json
{
  "type": "add",
  "operands": [
    {"type": "constant", "value": 10},
    {"type": "constant", "value": 5}
  ]
}
```

**セル参照**:
```json
{
  "type": "cell_reference",
  "table": "current",
  "column": "A",
  "row": "1"
}
```

**複合計算**:
```json
{
  "type": "multiply",
  "operands": [
    {"type": "cell_reference", "table": "current", "column": "price"},
    {"type": "add", "operands": [
      {"type": "cell_reference", "table": "current", "column": "quantity"},
      {"type": "constant", "value": 1}
    ]}
  ]
}
```

### 数式をセルに適用
```bash
curl -X POST http://localhost:3001/api/tables/{tableId}/cells/{rowId}/{columnId}/apply-formula \
  -H "Content-Type: application/json" \
  -d '{"formulaId": "formula_id_here"}'
```

## プロジェクト構造

```
calculationTables/
├── .claude/                # Claude Code設定・仕様書
│   ├── instructions.md     # 実装手順書
│   └── systemdesign.md     # システム設計仕様
├── backend/                # Node.js API サーバー
│   ├── src/
│   │   ├── models/         # MongoDB モデル定義
│   │   ├── controllers/    # API コントローラー
│   │   ├── routes/         # API ルーティング
│   │   ├── engine/         # 計算エンジン & 依存関係管理
│   │   ├── websocket/      # WebSocket ハンドラー
│   │   └── app.js          # メインアプリケーション
│   └── tests/              # テストファイル
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   │   ├── Toolbar.tsx            # ツールバー
│   │   │   ├── Sidebar.tsx            # サイドバー
│   │   │   ├── SimpleTableGrid.tsx    # 表グリッド
│   │   │   ├── FormulaEditor.tsx      # 数式エディタ
│   │   │   ├── FormulaApplicator.tsx  # 数式適用器
│   │   │   ├── CalculationHistory.tsx # 計算履歴表示
│   │   │   └── Console.tsx            # 統合コンソール
│   │   ├── hooks/          # カスタムフック
│   │   │   ├── useTableManagement.ts  # テーブル管理
│   │   │   ├── useTableData.ts        # テーブルデータ
│   │   │   ├── useWebSocket.ts        # WebSocket
│   │   │   ├── useFormula.ts          # 数式処理
│   │   │   └── useConsole.ts          # コンソール管理
│   │   └── App.tsx         # メインアプリケーション
├── shared/                 # 共有型定義
└── docker-compose.yml      # 開発環境設定
```

## 開発コマンド

```bash
# バックエンドテスト実行
cd backend && npm test

# バックエンド開発サーバー（ホットリロード）
cd backend && npm run dev

# フロントエンド開発サーバー
cd frontend && npm start

# Dockerサービス管理
docker compose up -d     # サービス起動
docker compose down      # サービス停止
docker compose logs      # ログ確認
```

## API エンドポイント

### 基本操作
- `GET /health` - ヘルスチェック
- `POST /api/tables` - テーブル作成
- `GET /api/tables/:id` - テーブル取得
- `PUT /api/tables/:id` - テーブル更新
- `DELETE /api/tables/:id` - テーブル削除

### セル操作
- `GET /api/tables/:id/cells` - テーブルのセル一覧
- `PUT /api/tables/:tableId/cells/:rowId/:columnId` - セル値更新
- `POST /api/tables/:tableId/rows` - 行追加
- `DELETE /api/tables/:tableId/rows/:rowId` - 行削除

### 数式操作
- `GET /api/formulas` - 数式一覧取得
- `POST /api/formulas` - 数式作成
- `PUT /api/formulas/:id` - 数式更新
- `DELETE /api/formulas/:id` - 数式削除
- `POST /api/tables/:tableId/cells/:rowId/:columnId/apply-formula` - セルに数式適用

### 計算履歴
- `GET /api/tables/:tableId/calculation-history` - テーブルの計算履歴取得

## 特徴的な機能

### 1. モダンなUI/UX
- **ツールバー**: 直感的な操作ボタンとステータス表示
- **サイドバー**: テーブル・数式の一覧管理
- **グリッド**: TanStack React Table採用で高性能な表示・編集
- **数式エディタ**: リアルタイムエラー表示とシンタックスヒント
- **視覚的表示**: 数式適用セルの緑色ハイライトと「f」アイコン表示
- **統合コンソール**: ターミナル風のリアルタイム操作ログ表示

### 2. リアルタイム依存関係管理
セルの値が変更されると、そのセルに依存する全てのセルが自動的に再計算されます。

### 3. 循環参照検出
トポロジカルソートを使用して循環参照を検出し、エラーを防止します。

### 4. 計算キャッシュ
Redisを使用して計算結果をキャッシュし、同じ計算の繰り返しを回避します。

### 5. WebSocketリアルタイム更新
複数のクライアント間でセルの変更をリアルタイムに同期します。

### 6. 計算履歴トレース
数式適用の完全な履歴を記録し、以下の機能を提供します：
- **自動履歴保存**: 数式適用時に自動的に履歴をデータベースに保存
- **詳細情報記録**: セル位置、数式名、計算式、結果値、適用日時を記録
- **履歴表示**: ツールバーから過去の計算履歴を時系列で表示
- **視覚的識別**: 数式適用済みセルを緑色背景と「f」アイコンで表示
- **ホバー情報**: セルにマウスを合わせると適用されている数式名を表示

### 7. 統合コンソールシステム
プロフェッショナルなターミナル風コンソールで操作状況を可視化：
- **リアルタイム表示**: 全ての操作結果をリアルタイムでコンソールに表示
- **メッセージ分類**: 成功、警告、エラー、情報の4種類でメッセージを色分け表示
- **タイムスタンプ**: 各メッセージに正確な時刻を記録
- **自動スクロール**: 新しいメッセージに自動スクロールして最新情報を常に表示
- **履歴管理**: 最大100メッセージまで自動管理、古いメッセージは自動削除
- **レスポンシブレイアウト**: コンソール表示時も他の要素が適切に表示される設計

## トラブルシューティング

**MongoDB接続エラー**:
```bash
# MongoDB サービス確認
docker compose ps mongodb

# MongoDB ログ確認
docker compose logs mongodb
```

**Redis接続エラー**:
```bash
# Redis サービス確認
docker compose ps redis

# Redis ログ確認
docker compose logs redis
```

**フロントエンド依存関係エラー**:
```bash
# node_modules 再インストール
cd frontend && rm -rf node_modules package-lock.json && npm install
```

**コンソールメッセージが表示されない**:
- ツールバーの「🖥️ コンソール」ボタンをクリックしてコンソールを表示
- 操作を実行すると自動的にメッセージが表示されます
- 「クリア」ボタンでメッセージ履歴をリセット可能

**レイアウトが崩れる場合**:
- ブラウザの画面サイズを確認（最小推奨幅: 1200px）
- コンソール表示時は表グリッドが60%のサイズに調整されます
- F5キーでページをリフレッシュしてレイアウトをリセット

## ライセンス

MIT