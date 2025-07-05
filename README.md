# データベース駆動型スプレッドシートシステム

複数のテーブル間でデータと計算式を管理し、計算式をJSON形式で保存・再利用可能なスプレッドシートシステムです。

## 主な特徴

🔄 **リアルタイム計算**: セル値変更時の自動再計算と依存関係の管理  
📊 **JSON形式の数式**: 計算式をJSONオブジェクトとして保存・テンプレート化  
🔗 **テーブル間参照**: 複数のテーブル間でのデータ参照と計算  
⚡ **高性能**: Redisキャッシュによる高速計算とWebSocketリアルタイム更新  
🏗️ **スケーラブル**: MongoDB + Express + React + TypeScriptの堅牢な構成  

## 技術スタック

- **Backend**: Node.js, Express, MongoDB, Redis, Socket.IO
- **Frontend**: React, TypeScript, AG-Grid, Monaco Editor
- **Infrastructure**: Docker, Docker Compose

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

## 使用例

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

## プロジェクト構造

```
calculationTables/
├── backend/                 # Node.js API サーバー
│   ├── src/
│   │   ├── models/         # MongoDB モデル定義
│   │   ├── engine/         # 計算エンジン & 依存関係管理
│   │   ├── websocket/      # WebSocket ハンドラー
│   │   └── app.js          # メインアプリケーション
│   └── tests/              # テストファイル
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/     # React コンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   └── services/       # API クライアント
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

- `GET /health` - ヘルスチェック
- `POST /api/tables` - テーブル作成
- `GET /api/tables/:id` - テーブル取得
- `POST /api/formulas` - 数式作成
- `PUT /api/cells/:id` - セル値更新
- `GET /api/tables/:id/cells` - テーブルのセル一覧

## 特徴的な機能

### 1. リアルタイム依存関係管理
セルの値が変更されると、そのセルに依存する全てのセルが自動的に再計算されます。

### 2. 循環参照検出
トポロジカルソートを使用して循環参照を検出し、エラーを防止します。

### 3. 計算キャッシュ
Redisを使用して計算結果をキャッシュし、同じ計算の繰り返しを回避します。

### 4. WebSocketリアルタイム更新
複数のクライアント間でセルの変更をリアルタイムに同期します。

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

## ライセンス

ISC