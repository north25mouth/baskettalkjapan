/**
 * Firestoreの試合データをデバッグするスクリプト
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Firebase Admin初期化
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

async function debugMatches() {
  console.log('[debug-matches] Fetching all matches...');
  
  // すべての試合を取得
  const matchesSnapshot = await db.collection('matches')
    .orderBy('start_time', 'desc')
    .limit(20)
    .get();

  console.log(`[debug-matches] Found ${matchesSnapshot.size} matches\n`);

  if (matchesSnapshot.empty) {
    console.log('[debug-matches] No matches found in Firestore');
    console.log('[debug-matches] Please run: npm run sync:nba-games');
    return;
  }

  // 日本時間（JST）で今日の日付を取得
  const now = new Date();
  const jstOffset = 9 * 60; // JSTはUTC+9時間（分単位）
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jstTime = new Date(utcTime + (jstOffset * 60000));
  
  const todayJST = new Date(jstTime);
  todayJST.setHours(0, 0, 0, 0);
  const tomorrowJST = new Date(todayJST);
  tomorrowJST.setDate(tomorrowJST.getDate() + 1);
  
  const todayUTC = new Date(todayJST.getTime() - (jstOffset * 60000));
  const tomorrowUTC = new Date(tomorrowJST.getTime() - (jstOffset * 60000));

  console.log('[debug-matches] Current time (JST):', jstTime.toISOString());
  console.log('[debug-matches] Today range (JST):', todayJST.toISOString(), 'to', tomorrowJST.toISOString());
  console.log('[debug-matches] Query range (UTC):', todayUTC.toISOString(), 'to', tomorrowUTC.toISOString());
  console.log('');

  matchesSnapshot.docs.forEach((doc, index) => {
    const data = doc.data();
    const startTime = data.start_time.toDate();
    const startTimeJST = new Date(startTime.getTime() + (jstOffset * 60000));
    
    const isToday = startTime >= todayUTC && startTime < tomorrowUTC;
    
    console.log(`[Match ${index + 1}]`);
    console.log(`  ID: ${doc.id}`);
    console.log(`  Start time (UTC): ${startTime.toISOString()}`);
    console.log(`  Start time (JST): ${startTimeJST.toISOString()}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Is today: ${isToday ? 'YES' : 'NO'}`);
    console.log('');
  });

  // 今日の試合を検索
  console.log('[debug-matches] Searching for today\'s matches...');
  const todayMatches = await db.collection('matches')
    .where('start_time', '>=', admin.firestore.Timestamp.fromDate(todayUTC))
    .where('start_time', '<', admin.firestore.Timestamp.fromDate(tomorrowUTC))
    .orderBy('start_time')
    .get();

  console.log(`[debug-matches] Found ${todayMatches.size} matches for today`);
}

debugMatches()
  .then(() => {
    console.log('[debug-matches] Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[debug-matches] Error:', error);
    process.exit(1);
  });

