// 既存のチームデータにslugを追加するスクリプト
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// スラッグ生成関数
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[・\s]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// チーム名とslugのマッピング
const teamSlugMap = {
  "アトランタ・ホークス": "atlanta-hawks",
  "ボストン・セルティックス": "boston-celtics",
  "ブルックリン・ネッツ": "brooklyn-nets",
  "シャーロット・ホーネッツ": "charlotte-hornets",
  "シカゴ・ブルズ": "chicago-bulls",
  "クリーブランド・キャバリアーズ": "cleveland-cavaliers",
  "ダラス・マーベリックス": "dallas-mavericks",
  "デンバー・ナゲッツ": "denver-nuggets",
  "デトロイト・ピストンズ": "detroit-pistons",
  "ゴールデンステート・ウォリアーズ": "golden-state-warriors",
  "ヒューストン・ロケッツ": "houston-rockets",
  "インディアナ・ペイサーズ": "indiana-pacers",
  "LAクリッパーズ": "la-clippers",
  "LAレイカーズ": "la-lakers",
  "メンフィス・グリズリーズ": "memphis-grizzlies",
  "マイアミ・ヒート": "miami-heat",
  "ミルウォーキー・バックス": "milwaukee-bucks",
  "ミネソタ・ティンバーウルブズ": "minnesota-timberwolves",
  "ニューオーリンズ・ペリカンズ": "new-orleans-pelicans",
  "ニューヨーク・ニックス": "new-york-knicks",
  "オクラホマシティ・サンダー": "oklahoma-city-thunder",
  "オーランド・マジック": "orlando-magic",
  "フィラデルフィア・76ers": "philadelphia-76ers",
  "フェニックス・サンズ": "phoenix-suns",
  "ポートランド・トレイルブレイザーズ": "portland-trail-blazers",
  "サクラメント・キングス": "sacramento-kings",
  "サンアントニオ・スパーズ": "san-antonio-spurs",
  "トロント・ラプターズ": "toronto-raptors",
  "ユタ・ジャズ": "utah-jazz",
  "ワシントン・ウィザーズ": "washington-wizards"
};

async function updateTeamSlugs() {
  try {
    console.log('Firebaseを初期化中...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('チームデータを取得中...');
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    
    let updatedCount = 0;
    let skippedCount = 0;

    for (const teamDoc of teamsSnapshot.docs) {
      const data = teamDoc.data();
      const teamName = data.name;

      // 既にslugが存在する場合はスキップ
      if (data.slug) {
        console.log(`   ⏭ ${teamName}: 既にslugが存在します (${data.slug})`);
        skippedCount++;
        continue;
      }

      // slugを取得または生成
      const slug = teamSlugMap[teamName] || generateSlug(teamName);

      console.log(`   ✓ ${teamName}: slugを追加します (${slug})`);
      await updateDoc(doc(db, 'teams', teamDoc.id), {
        slug: slug
      });
      updatedCount++;
    }

    console.log('\n✅ 完了！');
    console.log(`   - 更新: ${updatedCount}件`);
    console.log(`   - スキップ: ${skippedCount}件`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

updateTeamSlugs();

