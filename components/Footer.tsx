import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* サイト情報 */}
          <div>
            <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400">
              BasketTalk Japan
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              日本語NBAファンコミュニティ
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">サイト</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  このサイトについて
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  コミュニティ
                </Link>
              </li>
            </ul>
          </div>

          {/* コミュニティ */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">コミュニティ</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/community/new"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  新規スレ作成
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  記事一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">お問い合わせ</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:contact@baskettalkjapan.com"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} BasketTalk Japan. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-500">
            このサイトは非公式のファンコミュニティです。NBA、各チーム、選手とは一切関係がありません。
          </p>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-500">
            NBA、各チーム名、ロゴ、商標は、それぞれの所有者の財産です。当サイトでの使用は、フェアユースの範囲内での使用です。
          </p>
        </div>
      </div>
    </footer>
  );
}

