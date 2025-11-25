// 今日の試合機能のバックアップ
// 復元する場合は、このコードを app/page.tsx に追加してください

// まずFirestoreから試合を取得、なければNBA APIから直接取得
try {
  const { getTodayMatches } = await import('@/lib/firebase/firestore');
  todayMatches = await getTodayMatches();
  
  // Firestoreに試合がない場合、NBA APIから直接取得
  if (todayMatches.length === 0) {
    try {
      const { getTodayGames, convertGameStatus } = await import('@/lib/nba/api');
      const { getTeamByAbbreviation } = await import('@/lib/firebase/firestore');
      
      // 日本時間で今日の日付を取得
      const now = new Date();
      const jstOffset = 9 * 60; // JSTはUTC+9時間（分単位）
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const jstTime = new Date(utcTime + (jstOffset * 60000));
      const todayJST = new Date(jstTime);
      todayJST.setHours(0, 0, 0, 0);
      
      const nbaGames = await getTodayGames();
      console.log('[Home] Fetched', nbaGames.length, 'games from NBA API');
      
      // NBA APIの試合データを変換
      for (const game of nbaGames) {
        const gameDate = new Date(game.date);
        const gameDateJST = new Date(gameDate.getTime() + (jstOffset * 60000));
        
        // 日本時間で今日の試合のみを表示
        if (gameDateJST >= todayJST && gameDateJST < new Date(todayJST.getTime() + 24 * 60 * 60 * 1000)) {
          const homeTeam = await getTeamByAbbreviation(game.home_team.abbreviation);
          const awayTeam = await getTeamByAbbreviation(game.visitor_team.abbreviation);
          
          if (homeTeam && awayTeam) {
            todayMatches.push({
              id: `nba-${game.id}`, // 一時的なID
              team_home_id: homeTeam.id,
              team_away_id: awayTeam.id,
              homeTeam,
              awayTeam,
              start_time: gameDate,
              status: convertGameStatus(game.status, game.period || 0, game.home_team_score),
              score_home: game.home_team_score,
              score_away: game.visitor_team_score,
              nba_game_id: game.id,
            });
          }
        }
      }
      
      // 開始時間順にソート
      todayMatches.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
    } catch (apiError) {
      console.error('[Home] Error fetching from NBA API:', apiError);
    }
  }
} catch (error) {
  console.error('[Home] Error fetching matches:', error);
  todayMatches = [];
}

// 今日の試合セクションのJSX
{/* ファーストビュー：今日の試合 */}
<section className="mb-8">
  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
    今日の試合
  </h2>
  {todayMatches.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {todayMatches.map((match) => {
        // 日本時間で時刻を表示
        const jstOffset = 9 * 60; // JSTはUTC+9時間（分単位）
        const matchTimeJST = new Date(match.start_time.getTime() + (jstOffset * 60000));
        const timeStr = `${String(matchTimeJST.getHours()).padStart(2, '0')}:${String(matchTimeJST.getMinutes()).padStart(2, '0')}`;
        
        // 試合がFirestoreに存在する場合のみリンクを表示
        const hasMatchId = match.id && !match.id.startsWith('nba-');
        const matchUrl = hasMatchId ? `/community/match/${match.id}` : '#';
        const Component = hasMatchId ? Link : 'div';
        
        return (
          <Component
            key={match.id}
            href={matchUrl}
            className={`rounded-lg border border-gray-200 bg-white p-4 transition-shadow ${hasMatchId ? 'hover:shadow-md cursor-pointer' : ''} dark:border-gray-700 dark:bg-gray-800`}
          >
            <div className="text-center">
              {match.homeTeam && match.awayTeam && (
                <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {match.awayTeam.name} vs {match.homeTeam.name}
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {timeStr}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                {match.status === 'live' && (
                  <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">
                    生放送中
                  </span>
                )}
                {match.status === 'finished' && (
                  <span className="rounded bg-gray-500 px-2 py-1 text-xs text-white">
                    終了
                  </span>
                )}
                {match.score_home !== null && match.score_away !== null && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {match.score_away} - {match.score_home}
                  </span>
                )}
              </div>
            </div>
          </Component>
        );
      })}
    </div>
  ) : (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-400">
        今日の試合はありません
      </p>
    </div>
  )}
</section>

