export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          このサイトについて
        </h1>

        <div className="space-y-8">
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              BasketTalk Japanとは
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              BasketTalk Japanは、日本語でNBAを楽しむファンコミュニティです。
              試合ごとのスレッド、チーム別掲示板、記事・コラムを通じて、
              日本のNBAファンが集まり、情報を共有し、議論できる場を提供します。
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              主な機能
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
              <li>試合ごとのスレッド（自動生成・検索可能）</li>
              <li>チーム別掲示板（全30チーム）</li>
              <li>自由スレッド作成（タグ付け対応）</li>
              <li>投稿・返信・いいね・通報・ブックマーク機能</li>
              <li>通知機能（返信・いいね）</li>
              <li>記事・コラム（翻訳記事含む）</li>
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              非公式サイトについて
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              当サイトは非公式のファンコミュニティです。
              NBA、各チーム、選手とは一切関係がありません。
              ファンが集まり、情報を共有し、議論するためのコミュニティスペースとして運営されています。
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              お問い合わせ
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              ご質問やお問い合わせは、以下のメールアドレスまでご連絡ください：
            </p>
            <p className="mt-2">
              <a
                href="mailto:contact@baskettalkjapan.com"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                contact@baskettalkjapan.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

