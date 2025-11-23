export default function RulesPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          利用規約・著作権ポリシー
        </h1>

        <div className="space-y-8">
          {/* 利用規約 */}
          <section id="terms" className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              利用規約
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                本利用規約（以下「本規約」といいます）は、BasketTalk Japan（以下「当サイト」といいます）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます）には、本規約に従って、当サイトをご利用いただきます。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">1. 適用</h3>
              <p className="mb-4">
                本規約は、ユーザーと当サイトとの間の当サイトの利用に関わる一切の関係に適用されるものとします。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">2. 非公式サイトについて</h3>
              <p className="mb-4">
                当サイトは非公式のファンコミュニティです。NBA、各チーム、選手とは一切関係がありません。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">3. 利用登録</h3>
              <p className="mb-4">
                当サイトの利用を希望する者は、本規約に同意の上、当サイトの定める方法によって利用登録を申請し、当サイトがこれを承認することによって、利用登録が完了するものとします。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">4. ユーザーIDおよびパスワードの管理</h3>
              <p className="mb-4">
                ユーザーは、自己の責任において、当サイトのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーIDまたはパスワードが第三者に使用されたことによって生じた損害は、当サイトに故意または重大な過失がある場合を除き、当サイトは一切の責任を負いません。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">5. 禁止事項</h3>
              <p className="mb-4">ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サイトの内容等、当サイトに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                <li>当サイト、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サイトによって得られた情報を商業的に利用する行為</li>
                <li>当サイトの運営を妨害するおそれのある行為</li>
                <li>不正アクセス、不正な方法による情報の取得</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って当サイトを利用する行為</li>
                <li>当サイトの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                <li>その他、当サイトが不適切と判断する行為</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-semibold">6. 当サイトの提供の停止等</h3>
              <p className="mb-4">
                当サイトは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サイトの全部または一部の提供を停止または中断することができるものとします。
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>当サイトにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、当サイトの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当サイトが当サイトの提供が困難と判断した場合</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-semibold">7. 保証の否認および免責</h3>
              <p className="mb-4">
                当サイトは、当サイトに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">8. 利用規約の変更</h3>
              <p className="mb-4">
                当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サイトの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
              </p>
            </div>
          </section>

          {/* 著作権ポリシー */}
          <section id="copyright" className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              著作権ポリシー
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              <h3 className="mt-6 mb-3 text-xl font-semibold">1. 画像・映像について</h3>
              <p className="mb-4">
                当サイトでは、以下の方法での画像・映像の利用を許可しています：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>YouTube公式チャンネルの動画埋め込み</li>
                <li>Twitter公式アカウントのツイート埋め込み</li>
                <li>その他、公式が提供する埋め込み機能の利用</li>
              </ul>
              <p className="mt-4 mb-4">
                <strong>禁止事項：</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>スクリーンショットや第三者画像の無断アップロード</li>
                <li>著作権者の許可なく画像・映像をダウンロードしてアップロードする行為</li>
                <li>公式でない埋め込みコードの使用</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-semibold">2. 翻訳記事について</h3>
              <p className="mb-4">
                翻訳記事を投稿する際は、以下のルールを遵守してください：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>全文転載は禁止です</li>
                <li>原文の出典URLを必ず明記してください</li>
                <li>翻訳は「引用＋要約＋独自コメント」を基本とします</li>
                <li>原文の著作者の権利を尊重してください</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-semibold">3. ユーザー投稿の著作権</h3>
              <p className="mb-4">
                ユーザーが投稿したコンテンツの著作権は、投稿者に帰属します。ただし、当サイトは、当サイト内での利用、表示、配信のために必要な範囲で、ユーザーが投稿したコンテンツを使用することができるものとします。
              </p>
              <p className="mb-4">
                投稿時に、著作権違反していない旨の確認チェックを必須とします。違反投稿は削除対象となり、悪質な場合はアカウント凍結の対象となります。
              </p>

              <h3 className="mt-6 mb-3 text-xl font-semibold">4. DMCA対応</h3>
              <p className="mb-4">
                著作権侵害の申し立てがある場合、当サイトは適切に対応いたします。以下の連絡先までご連絡ください：
              </p>
              <p className="mb-4">
                <strong>連絡先：</strong> contact@baskettalkjapan.com
              </p>
              <p className="mb-4">
                申し立ての際は、以下の情報を含めてください：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>著作権者の氏名または名称</li>
                <li>侵害されている著作物の説明</li>
                <li>侵害されているコンテンツのURL</li>
                <li>連絡先情報</li>
                <li>申し立ての内容が真実であることの宣誓</li>
              </ul>
            </div>
          </section>

          {/* 最終更新日 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            最終更新日: 2025-11-23
          </div>
        </div>
      </div>
    </div>
  );
}

