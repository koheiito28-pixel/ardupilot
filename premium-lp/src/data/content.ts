/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CONTENT / DUMMY DATA
 * ─────────────────────────────────────────────────────────────────────────
 *  This file is the single source of truth for every piece of copy, number
 *  and label on the page. To rebrand the LP for a real product, edit ONLY
 *  this file (and swap the placeholder assets described in README.md).
 *
 *  - Product name / hero copy ........ `brand`, `hero`
 *  - 3D model ........................ see src/components/three/ProductScene.tsx
 *  - Section copy .................... the exported arrays / objects below
 *  - Images ......................... currently CSS gradients; replace `image`
 *                                      fields with real <img src> paths.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'AURA',
  tagline: '次世代プロダクト体験',
};

export const nav = {
  links: [
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'Features', href: '#features' },
    { label: 'Process', href: '#process' },
    { label: 'Results', href: '#results' },
  ],
  cta: { label: '資料請求', href: '#cta' },
};

export const hero = {
  eyebrow: 'AI × Precision Manufacturing',
  // Each line animates in word-by-word.
  titleLines: ['見えなかった精度を,', '光で可視化する。'],
  subtitle:
    '製造現場のあらゆる工程を、リアルタイムに解析。AURA は検査・最適化・予測を一つの体験に統合します。',
  primaryCta: { label: '無料デモを予約', href: '#cta' },
  secondaryCta: { label: '製品を見る', href: '#solution' },
};

export const problem = {
  eyebrow: 'The Challenge',
  title: '現場の「見えない損失」を、放置していませんか。',
  subtitle:
    '熟練者の感覚に依存した検査、属人化した判断基準、後追いの品質管理。それは静かに利益を削り続けます。',
  cards: [
    {
      icon: '01',
      title: '属人化する検査品質',
      body: '担当者によって判定がばらつき、不良の見逃しと過検出が同時に発生する。',
    },
    {
      icon: '02',
      title: '後手に回る異常検知',
      body: '問題が顕在化してから対応するため、ライン停止と手戻りコストが膨らむ。',
    },
    {
      icon: '03',
      title: '分断されたデータ',
      body: '工程ごとに情報が孤立し、全体最適のための意思決定ができない。',
    },
    {
      icon: '04',
      title: '見えない機会損失',
      body: '改善の余地がどこにあるか可視化できず、現場の勘に頼らざるを得ない。',
    },
  ],
};

export const solution = {
  eyebrow: 'The Product',
  title: '一つのコアが、すべての工程を照らす。',
  // Each step is pinned alongside the 3D product; copy switches on scroll.
  steps: [
    {
      tag: 'Sense',
      title: '0.01mm の精度で捉える',
      body: 'マルチスペクトルセンサーが表面の微細な異常までリアルタイムに捕捉。人の目では捉えられない領域を数値化します。',
      metric: { value: 0.01, suffix: 'mm', label: '検出精度' },
    },
    {
      tag: 'Analyze',
      title: 'AIが判断基準を統一する',
      body: '自己学習する解析エンジンが、属人化していた判定を一貫した基準へ。良否判定の根拠を可視化します。',
      metric: { value: 99.9, suffix: '%', label: '判定一致率' },
    },
    {
      tag: 'Predict',
      title: '異常を、起きる前に。',
      body: '工程データの相関から劣化の兆候を予測。ライン停止の前に最適なタイミングで介入できます。',
      metric: { value: 72, suffix: 'h', label: '予兆検知リード' },
    },
  ],
};

export const features = {
  eyebrow: 'Capabilities',
  title: '現場が、欲しかった機能を。',
  // Click a card → FLIP-expands into a detail panel.
  cards: [
    {
      id: 'realtime',
      title: 'リアルタイム解析',
      summary: '毎秒120フレームを遅延なく処理',
      detail:
        'エッジ推論により、クラウドを介さずライン速度に追従。ネットワーク障害時も検査を止めません。専用GPUは不要で、既存設備に後付けできます。',
      accent: 'ocean',
    },
    {
      id: 'nolearn',
      title: 'ノーコード学習',
      summary: '良品サンプル数枚で運用開始',
      detail:
        '異常検知モデルは良品データだけで学習可能。専門知識がなくても、現場の担当者がブラウザ上で数分でモデルを更新できます。',
      accent: 'violet',
    },
    {
      id: 'integrate',
      title: 'シームレス連携',
      summary: 'PLC・MES・ERPと即接続',
      detail:
        '標準プロトコルとREST APIを備え、既存の生産管理システムへスムーズに統合。データのサイロ化を解消します。',
      accent: 'emerald',
    },
    {
      id: 'trace',
      title: '完全トレーサビリティ',
      summary: '全判定をエビデンス付きで記録',
      detail:
        '一つひとつの判定結果を画像・スコア付きで保存。監査対応やクレーム調査の工数を劇的に削減します。',
      accent: 'cyan',
    },
    {
      id: 'secure',
      title: 'エンタープライズ品質',
      summary: 'オンプレ / 閉域網に対応',
      detail:
        '機密性の高い製造データも安心。シングルサインオン、ロールベースアクセス制御、暗号化を標準装備します。',
      accent: 'ocean',
    },
  ],
};

export const process = {
  eyebrow: 'How it works',
  title: '導入は、4ステップ。',
  subtitle: '最短2週間で、現場が変わりはじめます。',
  steps: [
    { no: '01', title: 'ヒアリング', body: '現場課題と既存設備を診断し、最適な構成を設計します。' },
    { no: '02', title: 'PoC 検証', body: 'サンプルデータで効果を定量検証。投資対効果を可視化します。' },
    { no: '03', title: '本番導入', body: '既存ラインへ非停止で組み込み。担当者へ運用を移管します。' },
    { no: '04', title: '継続最適化', body: '稼働データをもとに精度を継続改善。伴走支援を行います。' },
  ],
};

export const results = {
  eyebrow: 'Proven Impact',
  title: '数字が、確かな変化を語る。',
  subtitle: '導入企業120社以上の平均実績（※ダミーデータ）。',
  stats: [
    { value: 99.8, suffix: '%', label: '検査精度', decimals: 1 },
    { value: 67, suffix: '%', label: '検査工数の削減', decimals: 0 },
    { value: 4.2, suffix: 'x', label: '不良流出の低減', decimals: 1 },
    { value: 14, suffix: '日', label: '平均導入期間', decimals: 0 },
  ],
  beforeAfter: {
    before: { label: 'Before', value: '3.2%', caption: '不良流出率（目視検査）' },
    after: { label: 'After', value: '0.4%', caption: '不良流出率（AURA導入後）' },
  },
};

export const showcase = {
  eyebrow: 'Lineup',
  title: 'すべての現場に、最適な一台を。',
  items: [
    { name: 'AURA One', spec: 'コンパクト検査ユニット', tag: 'Entry', tone: 'ocean' },
    { name: 'AURA Pro', spec: '高速ライン向け標準機', tag: 'Standard', tone: 'violet' },
    { name: 'AURA Max', spec: '大型・多軸対応フラッグシップ', tag: 'Flagship', tone: 'emerald' },
    { name: 'AURA Edge', spec: '分散エッジ推論モジュール', tag: 'Module', tone: 'cyan' },
    { name: 'AURA Cloud', spec: '統合管理プラットフォーム', tag: 'Platform', tone: 'ocean' },
  ],
};

export const cta = {
  eyebrow: 'Get Started',
  title: '次の標準を、\n あなたの現場から。',
  subtitle: '30分のオンラインデモで、AURAがもたらす変化を体感してください。',
  primary: { label: '無料デモを予約', href: '#' },
  secondary: { label: '資料をダウンロード', href: '#' },
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} AURA Inc. All rights reserved.`,
  note: 'このページのテキスト・数値・画像はすべてデモ用のダミーです。',
};
