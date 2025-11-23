// チームデータ投入スクリプト
// 使用方法: npm run seed:teams
// または: node scripts/seed-teams.js
// 注意: firebase-adminパッケージが必要です（npm install firebase-admin）

const admin = require('firebase-admin');

// .env.localから環境変数を読み込む（オプション）
require('dotenv').config({ path: '.env.local' });

// 環境変数から設定を取得
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error('❌ エラー: FIREBASE_PROJECT_ID が設定されていません');
  console.error('   .env.local ファイルに NEXT_PUBLIC_FIREBASE_PROJECT_ID=baskettalkjapan を設定してください');
  process.exit(1);
}

// Firebase Admin SDKを初期化（Application Default Credentialsを使用）
// 注意: 初回実行時は firebase login が必要な場合があります
try {
  admin.initializeApp({
    projectId: projectId,
  });
  console.log(`✅ Firebase Admin SDKを初期化しました (プロジェクト: ${projectId})`);
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    // 既に初期化されている場合は無視
    admin.app();
  } else {
    console.error('❌ Firebase Admin SDKの初期化に失敗しました:', error.message);
    console.error('   解決方法: firebase login を実行してください');
    process.exit(1);
  }
}

const db = admin.firestore();

const teams = [
  { name: "アトランタ・ホークス", abbreviation: "ATL", region: "East" },
  { name: "ボストン・セルティックス", abbreviation: "BOS", region: "East" },
  { name: "ブルックリン・ネッツ", abbreviation: "BKN", region: "East" },
  { name: "シャーロット・ホーネッツ", abbreviation: "CHA", region: "East" },
  { name: "シカゴ・ブルズ", abbreviation: "CHI", region: "East" },
  { name: "クリーブランド・キャバリアーズ", abbreviation: "CLE", region: "East" },
  { name: "ダラス・マーベリックス", abbreviation: "DAL", region: "West" },
  { name: "デンバー・ナゲッツ", abbreviation: "DEN", region: "West" },
  { name: "デトロイト・ピストンズ", abbreviation: "DET", region: "East" },
  { name: "ゴールデンステート・ウォリアーズ", abbreviation: "GSW", region: "West" },
  { name: "ヒューストン・ロケッツ", abbreviation: "HOU", region: "West" },
  { name: "インディアナ・ペイサーズ", abbreviation: "IND", region: "East" },
  { name: "LAクリッパーズ", abbreviation: "LAC", region: "West" },
  { name: "LAレイカーズ", abbreviation: "LAL", region: "West" },
  { name: "メンフィス・グリズリーズ", abbreviation: "MEM", region: "West" },
  { name: "マイアミ・ヒート", abbreviation: "MIA", region: "East" },
  { name: "ミルウォーキー・バックス", abbreviation: "MIL", region: "East" },
  { name: "ミネソタ・ティンバーウルブズ", abbreviation: "MIN", region: "West" },
  { name: "ニューオーリンズ・ペリカンズ", abbreviation: "NOP", region: "West" },
  { name: "ニューヨーク・ニックス", abbreviation: "NYK", region: "East" },
  { name: "オクラホマシティ・サンダー", abbreviation: "OKC", region: "West" },
  { name: "オーランド・マジック", abbreviation: "ORL", region: "East" },
  { name: "フィラデルフィア・76ers", abbreviation: "PHI", region: "East" },
  { name: "フェニックス・サンズ", abbreviation: "PHX", region: "West" },
  { name: "ポートランド・トレイルブレイザーズ", abbreviation: "POR", region: "West" },
  { name: "サクラメント・キングス", abbreviation: "SAC", region: "West" },
  { name: "サンアントニオ・スパーズ", abbreviation: "SAS", region: "West" },
  { name: "トロント・ラプターズ", abbreviation: "TOR", region: "East" },
  { name: "ユタ・ジャズ", abbreviation: "UTA", region: "West" },
  { name: "ワシントン・ウィザーズ", abbreviation: "WAS", region: "East" }
];

async function seedTeams() {
  try {
    console.log('\n📊 チームデータの投入を開始します...\n');
    
    // 既存のチームを確認
    const existingTeams = await db.collection('teams').get();
    if (!existingTeams.empty) {
      console.log(`⚠️  既に ${existingTeams.size} 件のチームデータが存在します`);
      console.log('   既存データはそのまま残し、新しいデータを追加します。\n');
    }
    
    // 既存のチーム名を取得（重複チェック用）
    const existingTeamNames = new Set();
    existingTeams.forEach(doc => {
      const data = doc.data();
      if (data.name) {
        existingTeamNames.add(data.name);
      }
    });
    
    // 新しいチームのみをフィルタリング
    const newTeams = teams.filter(team => !existingTeamNames.has(team.name));
    
    if (newTeams.length === 0) {
      console.log('✅ すべてのチームデータが既に存在します。');
      console.log('   Firestore Consoleで確認してください: https://console.firebase.google.com/\n');
      return;
    }
    
    console.log(`📝 ${newTeams.length} 件の新しいチームデータを追加します...\n`);
    
    // バッチ処理でデータを投入（500件まで）
    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    let count = 0;
    
    newTeams.forEach((team) => {
      const docRef = db.collection('teams').doc();
      batch.set(docRef, {
        ...team,
        created_at: now
      });
      count++;
    });
    
    await batch.commit();
    
    console.log(`✅ ${count} チームのデータを投入しました！`);
    console.log(`\n📋 投入されたチーム:`);
    newTeams.forEach(team => {
      console.log(`   - ${team.name} (${team.abbreviation})`);
    });
    console.log('\n🔗 Firestore Consoleで確認: https://console.firebase.google.com/');
    console.log('   プロジェクト > Firestore Database > データ > teams\n');
  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    if (error.code === 'permission-denied') {
      console.error('\n💡 解決方法:');
      console.error('   1. Firebase Consoleでセキュリティルールを確認');
      console.error('   2. 開発環境用のルールが設定されているか確認');
      console.error('   3. firebase login を実行して認証を確認');
    }
    process.exit(1);
  }
}

seedTeams();

