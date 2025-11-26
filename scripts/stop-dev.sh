#!/bin/bash
# 開発サーバーを安全に停止するスクリプト

echo "開発サーバーを停止しています..."

# ポート3000を使用しているプロセスを検索
PORT_3000=$(lsof -ti:3000 2>/dev/null)

if [ -n "$PORT_3000" ]; then
  echo "ポート3000で実行中のプロセスを停止: $PORT_3000"
  kill $PORT_3000
  sleep 2
  
  # まだ実行中の場合は強制終了
  if lsof -ti:3000 > /dev/null 2>&1; then
    echo "強制終了します..."
    kill -9 $PORT_3000
  fi
  echo "✅ 開発サーバーを停止しました"
else
  echo "✅ ポート3000で実行中のプロセスはありません"
fi

# Next.js開発サーバーのプロセスを検索
NEXT_PROCESS=$(pgrep -f "next dev" | head -1)

if [ -n "$NEXT_PROCESS" ]; then
  echo "Next.js開発サーバーを停止: $NEXT_PROCESS"
  kill $NEXT_PROCESS
  echo "✅ Next.js開発サーバーを停止しました"
fi

echo "完了しました"
