export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          プライバシーポリシー
        </h1>

        <div className="space-y-8">
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                BasketTalk Japan（以下「当サイト」といいます）は、ユーザーの個人情報の保護を重要視しており、個人情報の保護に関する法律（個人情報保護法）その他の関連法令を遵守し、適切に取り扱うものとします。
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                1. 収集する情報
              </h2>
              <p className="mb-4">当サイトは、以下の情報を収集する場合があります：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>アカウント情報：</strong>メールアドレス、パスワード（ハッシュ化）、表示名、自己紹介文、アバター画像</li>
                <li><strong>投稿情報：</strong>スレッド、コメント、いいね、ブックマークなどの投稿内容</li>
                <li><strong>利用情報：</strong>アクセスログ、IPアドレス、ブラウザ情報、デバイス情報</li>
                <li><strong>認証情報：</strong>Firebase Authenticationを通じた認証情報</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                2. 情報の利用目的
              </h2>
              <p className="mb-4">当サイトは、収集した情報を以下の目的で利用します：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>サービスの提供、運営、改善</li>
                <li>ユーザー認証、アカウント管理</li>
                <li>不正利用の防止、セキュリティ対策</li>
                <li>お問い合わせへの対応</li>
                <li>利用規約違反の調査、対応</li>
                <li>統計情報の作成（個人を特定できない形式）</li>
                <li>広告配信（後述の「広告について」を参照）</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                3. 情報の第三者提供
              </h2>
              <p className="mb-4">
                当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              </ul>
              <p className="mb-4">
                <strong>注意：</strong>当サイトは、以下のサービスを利用しており、これらのサービス提供者に情報が提供される場合があります：
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Firebase（Google）：</strong>認証、データベース、ホスティングサービス</li>
                <li><strong>Vercel：</strong>ホスティングサービス（アクセスログ等）</li>
                <li><strong>広告配信サービス：</strong>Google AdSense、その他の広告ネットワーク（後述）</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                4. 広告について
              </h2>
              <p className="mb-4">
                当サイトは、収益化のため、第三者配信の広告サービス（Google AdSense、その他の広告ネットワーク）を利用しています。
                これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するため、Cookie（クッキー）を使用することがあります。
              </p>
              <p className="mb-4">
                <strong>Cookieについて：</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Cookieは、ユーザーが当サイトを訪問した際に、ブラウザに保存される小さなテキストファイルです</li>
                <li>Cookieを使用することで、広告配信事業者は、ユーザーが過去にアクセスしたウェブサイトの情報に基づいて、適切な広告を配信することができます</li>
                <li>ユーザーは、ブラウザの設定により、Cookieの使用を無効にすることができます</li>
                <li>ただし、Cookieを無効にした場合、一部の機能が正常に動作しない場合があります</li>
              </ul>
              <p className="mb-4">
                <strong>広告配信事業者のプライバシーポリシー：</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Google AdSense: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">https://policies.google.com/privacy</a></li>
                <li>ユーザーは、<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">Google広告設定</a>から、パーソナライズ広告を無効にすることができます</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                5. アフィリエイトプログラムについて
              </h2>
              <p className="mb-4">
                当サイトは、アフィリエイトプログラムに参加している場合があります。
                当サイト内のリンクから商品やサービスを購入した場合、当サイトに紹介料が発生する場合があります。
                これは、ユーザーへの追加費用は発生せず、商品やサービスの価格に影響しません。
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                6. データの保存期間
              </h2>
              <p className="mb-4">
                当サイトは、ユーザーの個人情報を、利用目的の達成に必要な期間、または法令に基づく保存期間中、保存します。
                アカウントが削除された場合、個人情報は適切に削除または匿名化されます。
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                7. ユーザーの権利（GDPR対応）
              </h2>
              <p className="mb-4">
                ユーザーは、以下の権利を有します（EU一般データ保護規則（GDPR）に基づく）：
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>アクセス権：</strong>自分の個人情報へのアクセスを要求する権利</li>
                <li><strong>訂正権：</strong>不正確な個人情報の訂正を要求する権利</li>
                <li><strong>削除権：</strong>個人情報の削除を要求する権利（「忘れられる権利」）</li>
                <li><strong>処理制限権：</strong>個人情報の処理を制限する権利</li>
                <li><strong>データポータビリティ権：</strong>個人情報を構造化された形式で受け取る権利</li>
                <li><strong>異議申し立て権：</strong>個人情報の処理に異議を申し立てる権利</li>
              </ul>
              <p className="mb-4">
                これらの権利を行使する場合は、以下の連絡先までご連絡ください：
              </p>
              <p className="mb-4">
                <strong>連絡先：</strong> <a href="mailto:privacy@baskettalkjapan.com" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">privacy@baskettalkjapan.com</a>
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                8. セキュリティ対策
              </h2>
              <p className="mb-4">
                当サイトは、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のため、以下の対策を講じます：
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>パスワードのハッシュ化（Firebase Authentication）</li>
                <li>HTTPS通信の使用</li>
                <li>定期的なセキュリティ監査</li>
                <li>アクセス制御の実施</li>
                <li>データベースの暗号化</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                9. 未成年者の個人情報
              </h2>
              <p className="mb-4">
                当サイトは、13歳未満の子どもの個人情報を意図的に収集することはありません。
                13歳未満の子どもが個人情報を提供した場合、保護者の同意を得た上で適切に取り扱います。
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                10. プライバシーポリシーの変更
              </h2>
              <p className="mb-4">
                当サイトは、必要に応じて、本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、当サイト上に掲載した時点で効力を生じるものとします。
                重要な変更がある場合は、当サイト上で通知します。
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                11. お問い合わせ
              </h2>
              <p className="mb-4">
                個人情報の取り扱いに関するお問い合わせは、以下の連絡先までご連絡ください：
              </p>
              <p className="mb-4">
                <strong>連絡先：</strong> <a href="mailto:privacy@baskettalkjapan.com" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">privacy@baskettalkjapan.com</a>
              </p>
            </div>
          </section>

          {/* 最終更新日 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            最終更新日: 2025-11-26
          </div>
        </div>
      </div>
    </div>
  );
}

