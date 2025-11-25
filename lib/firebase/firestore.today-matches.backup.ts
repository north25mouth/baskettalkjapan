// 今日の試合取得機能のバックアップ
// 復元する場合は、この関数を lib/firebase/firestore.ts に追加してください

export async function getTodayMatches(): Promise<Match[]> {
  try {
    console.log('[getTodayMatches] Starting...');
    const db = getDb();
    
    // 日本時間（JST、UTC+9）で今日の日付を取得
    const now = new Date();
    const jstOffset = 9 * 60; // JSTはUTC+9時間（分単位）
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const jstTime = new Date(utcTime + (jstOffset * 60000));
    
    // 日本時間で今日の0時0分0秒を取得
    const todayJST = new Date(jstTime);
    todayJST.setHours(0, 0, 0, 0);
    const tomorrowJST = new Date(todayJST);
    tomorrowJST.setDate(tomorrowJST.getDate() + 1);
    
    // UTC時間に変換してFirestoreで検索（FirestoreはUTCで保存されているため）
    const todayUTC = new Date(todayJST.getTime() - (jstOffset * 60000));
    const tomorrowUTC = new Date(tomorrowJST.getTime() - (jstOffset * 60000));

    console.log('[getTodayMatches] Current time (JST):', jstTime.toISOString());
    console.log('[getTodayMatches] Today range (JST):', todayJST.toISOString(), 'to', tomorrowJST.toISOString());
    console.log('[getTodayMatches] Querying matches (UTC):', todayUTC.toISOString(), 'to', tomorrowUTC.toISOString());

    const matchesSnapshot = await getDocs(
      query(
        collection(db, 'matches'),
        where('start_time', '>=', dateToTimestamp(todayUTC)),
        where('start_time', '<', dateToTimestamp(tomorrowUTC)),
        orderBy('start_time')
      )
    );

    console.log('[getTodayMatches] Found matches:', matchesSnapshot.size);

    return matchesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      start_time: timestampToDate(doc.data().start_time),
      created_at: timestampToDate(doc.data().created_at),
    })) as Match[];
  } catch (error) {
    console.error('[getTodayMatches] Error occurred:', error);
    console.error('[getTodayMatches] Error details:', {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    // エラーが発生した場合は空配列を返す（ページが表示されるように）
    // インデックスエラーの場合は、エラーメッセージにリンクが含まれている
    if (error instanceof Error && error.message.includes('index')) {
      console.warn('[getTodayMatches] Index required. Please create the index.');
    }
    return [];
  }
}

