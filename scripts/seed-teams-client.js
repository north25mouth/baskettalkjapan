// チームデータ投入スクリプト（クライアント側Firebase SDK使用）
// 使用方法: node scripts/seed-teams-client.js
// 注意: このスクリプトはクライアント側のFirebase SDKを使用します

require('dotenv').config({ path: '.env.local' });

// 環境変数の確認
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error('❌ エラー: .env.local ファイルにFirebase設定がありません');
  process.exit(1);
}

// Firebase SDKを動的にインポート（Node.js環境用）
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, Timestamp } = require('firebase/firestore');

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// スラッグ生成関数
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[・\s]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const teams = [
  { name: "アトランタ・ホークス", abbreviation: "ATL", region: "East", slug: "atlanta-hawks" },
  { name: "ボストン・セルティックス", abbreviation: "BOS", region: "East", slug: "boston-celtics" },
  { name: "ブルックリン・ネッツ", abbreviation: "BKN", region: "East", slug: "brooklyn-nets" },
  { name: "シャーロット・ホーネッツ", abbreviation: "CHA", region: "East", slug: "charlotte-hornets" },
  { name: "シカゴ・ブルズ", abbreviation: "CHI", region: "East", slug: "chicago-bulls" },
  { name: "クリーブランド・キャバリアーズ", abbreviation: "CLE", region: "East", slug: "cleveland-cavaliers" },
  { name: "ダラス・マーベリックス", abbreviation: "DAL", region: "West", slug: "dallas-mavericks" },
  { name: "デンバー・ナゲッツ", abbreviation: "DEN", region: "West", slug: "denver-nuggets" },
  { name: "デトロイト・ピストンズ", abbreviation: "DET", region: "East", slug: "detroit-pistons" },
  { name: "ゴールデンステート・ウォリアーズ", abbreviation: "GSW", region: "West", slug: "golden-state-warriors" },
  { name: "ヒューストン・ロケッツ", abbreviation: "HOU", region: "West", slug: "houston-rockets" },
  { name: "インディアナ・ペイサーズ", abbreviation: "IND", region: "East", slug: "indiana-pacers" },
  { name: "LAクリッパーズ", abbreviation: "LAC", region: "West", slug: "la-clippers" },
  { name: "LAレイカーズ", abbreviation: "LAL", region: "West", slug: "la-lakers" },
  { name: "メンフィス・グリズリーズ", abbreviation: "MEM", region: "West", slug: "memphis-grizzlies" },
  { name: "マイアミ・ヒート", abbreviation: "MIA", region: "East", slug: "miami-heat" },
  { name: "ミルウォーキー・バックス", abbreviation: "MIL", region: "East", slug: "milwaukee-bucks" },
  { name: "ミネソタ・ティンバーウルブズ", abbreviation: "MIN", region: "West", slug: "minnesota-timberwolves" },
  { name: "ニューオーリンズ・ペリカンズ", abbreviation: "NOP", region: "West", slug: "new-orleans-pelicans" },
  { name: "ニューヨーク・ニックス", abbreviation: "NYK", region: "East", slug: "new-york-knicks" },
  { name: "オクラホマシティ・サンダー", abbreviation: "OKC", region: "West", slug: "oklahoma-city-thunder" },
  { name: "オーランド・マジック", abbreviation: "ORL", region: "East", slug: "orlando-magic" },
  { name: "フィラデルフィア・76ers", abbreviation: "PHI", region: "East", slug: "philadelphia-76ers" },
  { name: "フェニックス・サンズ", abbreviation: "PHX", region: "West", slug: "phoenix-suns" },
  { name: "ポートランド・トレイルブレイザーズ", abbreviation: "POR", region: "West", slug: "portland-trail-blazers" },
  { name: "サクラメント・キングス", abbreviation: "SAC", region: "West", slug: "sacramento-kings" },
  { name: "サンアントニオ・スパーズ", abbreviation: "SAS", region: "West", slug: "san-antonio-spurs" },
  { name: "トロント・ラプターズ", abbreviation: "TOR", region: "East", slug: "toronto-raptors" },
  { name: "ユタ・ジャズ", abbreviation: "UTA", region: "West", slug: "utah-jazz" },
  { name: "ワシントン・ウィザーズ", abbreviation: "WAS", region: "East", slug: "washington-wizards" }
];

async function seedTeams() {
  try {
    console.log('\n📊 チームデータの投入を開始します...\n');
    console.log(`✅ Firebaseを初期化しました (プロジェクト: ${firebaseConfig.projectId})\n`);
    
    // 既存のチームを確認
    const existingTeams = await getDocs(collection(db, 'teams'));
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
    
    // データを投入
    const now = Timestamp.now();
    let count = 0;
    
    for (const team of newTeams) {
      // slugが存在しない場合は生成
      const teamData = {
        ...team,
        slug: team.slug || generateSlug(team.name),
        created_at: now
      };
      await addDoc(collection(db, 'teams'), teamData);
      count++;
      console.log(`   ✓ ${team.name} (${team.abbreviation}) - ${teamData.slug} を追加しました`);
    }
    
    console.log(`\n✅ ${count} チームのデータを投入しました！`);
    console.log('\n🔗 Firestore Consoleで確認: https://console.firebase.google.com/');
    console.log('   プロジェクト > Firestore Database > データ > teams\n');
  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    if (error.code === 'permission-denied') {
      console.error('\n💡 解決方法:');
      console.error('   1. Firebase Consoleでセキュリティルールを確認');
      console.error('   2. 開発環境用のルールが設定されているか確認');
      console.error('   3. teamsコレクションへの書き込み権限があるか確認');
    }
    process.exit(1);
  }
}

seedTeams();

