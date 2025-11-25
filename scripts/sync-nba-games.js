/**
 * NBA試合データをFirestoreに同期するスクリプト
 * 
 * 使用方法:
 *   node scripts/sync-nba-games.js [date]
 * 
 * date: YYYY-MM-DD形式（省略時は今日）
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const API_BASE_URL = process.env.NBA_API_BASE_URL || 'https://api.balldontlie.io/v1';
const API_KEY = process.env.NBA_API_KEY || '';

/**
 * 指定された日付の試合を取得
 */
async function getGamesByDate(date) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD形式
  
  try {
    // Node.js環境ではhttpsモジュールを使用
    const https = require('https');
    const url = require('url');
    
    return new Promise((resolve, reject) => {
      const apiUrl = `${API_BASE_URL}/games?dates[]=${dateStr}`;
      const parsedUrl = url.parse(apiUrl);
      
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
          'User-Agent': 'BasketTalkJapan/1.0',
          'Content-Type': 'application/json',
        },
      };

      // APIキーがある場合はヘッダーに追加
      if (API_KEY) {
        options.headers['Authorization'] = `Bearer ${API_KEY}`;
      }

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`NBA API error: ${res.statusCode} ${res.statusMessage}`));
            return;
          }

          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData.data || []);
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  } catch (error) {
    console.error('[NBA API] Error fetching games:', error);
    throw error;
  }
}

/**
 * NBA APIの試合ステータスを内部のステータスに変換
 */
function convertGameStatus(status, period, homeScore) {
  if (status === 'Final' || status === 'Final/OT') {
    return 'finished';
  }
  if (status === 'In Progress' || period > 0) {
    return 'live';
  }
  if (status === 'Cancelled' || status === 'Postponed') {
    return 'cancelled';
  }
  return 'scheduled';
}

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
    // 開発環境では、環境変数から直接初期化
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

/**
 * チームの略称からFirestoreのチームIDを取得
 */
async function getTeamIdByAbbreviation(abbreviation) {
  const teamsSnapshot = await db.collection('teams')
    .where('abbreviation', '==', abbreviation)
    .limit(1)
    .get();

  if (teamsSnapshot.empty) {
    console.warn(`[sync-nba-games] Team not found: ${abbreviation}`);
    return null;
  }

  return teamsSnapshot.docs[0].id;
}

/**
 * NBA試合データをFirestoreのMatch形式に変換
 */
async function convertNBAGameToMatch(nbaGame) {
  const homeTeamId = await getTeamIdByAbbreviation(nbaGame.home_team.abbreviation);
  const awayTeamId = await getTeamIdByAbbreviation(nbaGame.visitor_team.abbreviation);

  if (!homeTeamId || !awayTeamId) {
    console.warn(`[sync-nba-games] Cannot find teams for game ${nbaGame.id}`);
    return null;
  }

  const startTime = new Date(nbaGame.date);
  const status = convertGameStatus(
    nbaGame.status,
    nbaGame.period,
    nbaGame.home_team_score
  );

  return {
    team_home_id: homeTeamId,
    team_away_id: awayTeamId,
    start_time: admin.firestore.Timestamp.fromDate(startTime),
    status: status,
    score_home: nbaGame.home_team_score,
    score_away: nbaGame.visitor_team_score,
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
    nba_game_id: nbaGame.id, // NBA APIの試合IDを保存（重複チェック用）
  };
}

/**
 * 試合をFirestoreに保存または更新
 */
async function saveOrUpdateMatch(matchData) {
  // NBA APIの試合IDで既存の試合を検索
  const existingMatches = await db.collection('matches')
    .where('nba_game_id', '==', matchData.nba_game_id)
    .limit(1)
    .get();

  if (!existingMatches.empty) {
    // 既存の試合を更新
    const matchDoc = existingMatches.docs[0];
    await matchDoc.ref.update({
      ...matchData,
      updated_at: admin.firestore.Timestamp.now(),
    });
    console.log(`[sync-nba-games] Updated match: ${matchDoc.id}`);
    return matchDoc.id;
  } else {
    // 新しい試合を作成
    const docRef = await db.collection('matches').add(matchData);
    console.log(`[sync-nba-games] Created match: ${docRef.id}`);
    return docRef.id;
  }
}

/**
 * 終了した試合のスレッドを削除
 */
async function deleteFinishedMatchThreads() {
  // 終了した試合を取得
  const finishedMatches = await db.collection('matches')
    .where('status', '==', 'finished')
    .get();

  console.log(`[sync-nba-games] Found ${finishedMatches.size} finished matches`);

  for (const matchDoc of finishedMatches.docs) {
    const matchId = matchDoc.id;
    
    // この試合に関連するスレッドを検索
    const threads = await db.collection('threads')
      .where('type', '==', 'match')
      .where('match_id', '==', matchId)
      .get();

    console.log(`[sync-nba-games] Found ${threads.size} threads for match ${matchId}`);

    // スレッドとその投稿を削除
    for (const threadDoc of threads.docs) {
      const threadId = threadDoc.id;

      // 投稿を削除
      const posts = await db.collection('posts')
        .where('thread_id', '==', threadId)
        .get();

      const deletePosts = posts.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePosts);
      console.log(`[sync-nba-games] Deleted ${posts.size} posts for thread ${threadId}`);

      // スレッドを削除
      await threadDoc.ref.delete();
      console.log(`[sync-nba-games] Deleted thread: ${threadId}`);
    }
  }
}

/**
 * メイン処理
 */
async function main() {
  const dateArg = process.argv[2];
  const targetDate = dateArg ? new Date(dateArg) : new Date();

  console.log(`[sync-nba-games] Syncing games for date: ${targetDate.toISOString().split('T')[0]}`);

  try {
    // NBA APIから試合データを取得
    const games = await getGamesByDate(targetDate);
    console.log(`[sync-nba-games] Fetched ${games.length} games from NBA API`);

    // 各試合をFirestoreに保存
    for (const game of games) {
      const matchData = await convertNBAGameToMatch(game);
      if (matchData) {
        await saveOrUpdateMatch(matchData);
      }
    }

    // 終了した試合のスレッドを削除（現在は無効化）
    // await deleteFinishedMatchThreads();

    console.log('[sync-nba-games] Sync completed successfully');
  } catch (error) {
    console.error('[sync-nba-games] Error:', error);
    process.exit(1);
  }
}

// スクリプトを実行
if (require.main === module) {
  main();
}

module.exports = { main, getGamesByDate, convertGameStatus };

