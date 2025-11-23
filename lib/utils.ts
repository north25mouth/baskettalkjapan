// ユーティリティ関数

// 日付フォーマット
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;

  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// テキストのサニタイズ（XSS対策）
export function sanitizeText(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// テキストの抜粋
export function excerpt(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// スレッドタイプの日本語表示
export function getThreadTypeLabel(type: 'match' | 'team' | 'free'): string {
  switch (type) {
    case 'match':
      return '試合スレ';
    case 'team':
      return 'チーム掲示板';
    case 'free':
      return '自由スレ';
    default:
      return type;
  }
}

// チームカラー（著作権に配慮した実装）
// 注意: 実際のチームカラーを使用していますが、問題がある場合は削除してください
export function getTeamColor(abbreviation: string): { primary: string; secondary: string } {
  const colors: Record<string, { primary: string; secondary: string }> = {
    ATL: { primary: '#E03A3E', secondary: '#C1D32F' }, // アトランタ・ホークス
    BOS: { primary: '#007A33', secondary: '#BA9653' }, // ボストン・セルティックス
    BKN: { primary: '#000000', secondary: '#FFFFFF' }, // ブルックリン・ネッツ
    CHA: { primary: '#1D1160', secondary: '#00788C' }, // シャーロット・ホーネッツ
    CHI: { primary: '#CE1141', secondary: '#000000' }, // シカゴ・ブルズ
    CLE: { primary: '#860038', secondary: '#FDBB30' }, // クリーブランド・キャバリアーズ
    DAL: { primary: '#00538C', secondary: '#002B5C' }, // ダラス・マーベリックス
    DEN: { primary: '#0E2240', secondary: '#FEC524' }, // デンバー・ナゲッツ
    DET: { primary: '#C8102E', secondary: '#1D42BA' }, // デトロイト・ピストンズ
    GSW: { primary: '#1D428A', secondary: '#FFC72C' }, // ゴールデンステート・ウォリアーズ
    HOU: { primary: '#CE1141', secondary: '#000000' }, // ヒューストン・ロケッツ
    IND: { primary: '#002D62', secondary: '#FDBB30' }, // インディアナ・ペイサーズ
    LAC: { primary: '#C8102E', secondary: '#1D42BA' }, // LAクリッパーズ
    LAL: { primary: '#552583', secondary: '#FDB927' }, // LAレイカーズ
    MEM: { primary: '#5D76A9', secondary: '#12173F' }, // メンフィス・グリズリーズ
    MIA: { primary: '#98002E', secondary: '#F9A01B' }, // マイアミ・ヒート
    MIL: { primary: '#00471B', secondary: '#EEE1C6' }, // ミルウォーキー・バックス
    MIN: { primary: '#0C2340', secondary: '#236192' }, // ミネソタ・ティンバーウルブズ
    NOP: { primary: '#0C2340', secondary: '#C8102E' }, // ニューオーリンズ・ペリカンズ
    NYK: { primary: '#006BB6', secondary: '#F58426' }, // ニューヨーク・ニックス
    OKC: { primary: '#007AC1', secondary: '#EF3B24' }, // オクラホマシティ・サンダー
    ORL: { primary: '#0077C0', secondary: '#C4CED4' }, // オーランド・マジック
    PHI: { primary: '#006BB6', secondary: '#ED174C' }, // フィラデルフィア・76ers
    PHX: { primary: '#1D1160', secondary: '#E56020' }, // フェニックス・サンズ
    POR: { primary: '#E03A3E', secondary: '#000000' }, // ポートランド・トレイルブレイザーズ
    SAC: { primary: '#5A2D81', secondary: '#63727A' }, // サクラメント・キングス
    SAS: { primary: '#C4CED4', secondary: '#000000' }, // サンアントニオ・スパーズ
    TOR: { primary: '#CE1141', secondary: '#000000' }, // トロント・ラプターズ
    UTA: { primary: '#002B5C', secondary: '#F9A01B' }, // ユタ・ジャズ
    WAS: { primary: '#002B5C', secondary: '#E31837' }, // ワシントン・ウィザーズ
  };

  return colors[abbreviation] || { primary: '#6B7280', secondary: '#9CA3AF' };
}

