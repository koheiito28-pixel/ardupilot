# AURA — Premium Landing Page

世界基準のプレミアムLP。React + Vite + TypeScript + Tailwind CSS + GSAP (ScrollTrigger / Pin / Timeline / MotionPath / Flip / Observer) + Three.js + Lottie で構築しています。

Apple / Dyson / Porsche / Linear / Stripe を参照した、**派手すぎず信頼感のある**先進的デザイン。スクロールするたびに理解が深まり、商品が欲しくなる構成です。

---

## 🚀 セットアップ

```bash
cd premium-lp

# 1. 依存関係をインストール
npm install

# 2. 開発サーバーを起動（http://localhost:5173）
npm run dev

# 3. 本番ビルド
npm run build

# 4. ビルド結果をプレビュー
npm run preview
```

> Node.js 18 以上を推奨します。

### 必要な npm パッケージ
`npm install` で `package.json` から一括導入されますが、明示すると以下のとおりです。

```bash
# ランタイム
npm install react react-dom three gsap lottie-web

# 開発（型・ビルド）
npm install -D vite @vitejs/plugin-react typescript \
  @types/react @types/react-dom @types/three \
  tailwindcss postcss autoprefixer
```

GSAP の ScrollTrigger / Observer / MotionPathPlugin / Flip はすべて **無料版**に含まれており、Club GreenSock 会員登録は不要です。

---

## 📁 ファイル構成

```
premium-lp/
├── index.html                  # フォント読み込み / メタ情報
├── package.json
├── vite.config.ts              # チャンク分割（three / gsap / lottie）
├── tailwind.config.js          # カラーパレット・イージング・キーフレーム
├── postcss.config.js
├── public/
│   └── lottie/
│       └── processing.json     # ★ Lottieプレースホルダー（差し替え可）
└── src/
    ├── main.tsx
    ├── App.tsx                 # セクションの組み立て＋ScrollTrigger.refresh
    ├── index.css               # Tailwind層・ユーティリティ・reduced-motion対応
    ├── vite-env.d.ts
    ├── data/
    │   └── content.ts          # ★ 全コピー・数値・ラインナップ（差し替えの中心）
    ├── hooks/
    │   ├── useReducedMotion.ts
    │   └── useIsomorphicLayoutEffect.ts
    ├── lib/
    │   └── gsap.ts             # GSAPプラグイン登録の一元管理
    └── components/
        ├── three/
        │   └── ProductScene.tsx    # ★ Three.js 360°回転＋スクロール連動PointLight
        ├── ui/
        │   ├── Button.tsx
        │   ├── SplitText.tsx       # 単語単位フェードアップ見出し
        │   ├── Counter.tsx         # 0→数値カウントアップ
        │   └── LottiePlayer.tsx    # lottie-webラッパー
        ├── layout/
        │   ├── Nav.tsx
        │   └── Footer.tsx
        └── sections/
            ├── Hero.tsx        # GSAP Timelineで順番に登場＋3D＋粒子
            ├── Problem.tsx     # 課題カード（Stagger）
            ├── Solution.tsx    # 商品Pin＋スクロールで説明切替（Apple風）
            ├── Features.tsx    # 横scroll-snap＋FLIP詳細展開
            ├── Process.tsx     # SVG Draw＋MotionPathでデータが流れる
            ├── Results.tsx     # Counter＋clip-path reveal＋Before/After
            ├── Showcase.tsx    # 縦スクロール→横スクロール＋Observer慣性＋360°
            └── CTA.tsx         # PointLight背景＋Lottie＋高級ホバー
```

---

## 🎬 実装した演出（要件対応表）

| # | 演出 | 実装場所 |
|---|------|----------|
| 1 | Three.js 360°回転（プラグイン非依存・ドラッグ/スワイプ） | `three/ProductScene.tsx` |
| 2 | WebGL PointLight（スクロールで強さ・位置・色が変化） | `three/ProductScene.tsx` |
| 3 | CSS scroll-snap 横スクロール | `sections/Features.tsx`, `index.css (.snap-x-rail)` |
| 4 | GSAP ScrollTrigger（商品固定・説明切替） | `sections/Solution.tsx` |
| 5 | GSAP Pin | `sections/Solution.tsx`, `Showcase.tsx` |
| 6 | GSAP Timeline（FVの順次登場） | `sections/Hero.tsx` |
| 7 | Stagger | `Problem.tsx`, `Process.tsx`, `Results.tsx`, `CTA.tsx` |
| 8 | Fade / Slide / Scale / Rotate | 各セクション |
| 9 | Clip-path Animation | `sections/Results.tsx` |
| 10 | Text Animation（単語単位フェードアップ） | `ui/SplitText.tsx`, `Hero.tsx` |
| 11 | Counter Animation | `ui/Counter.tsx`（Solution / Results で使用） |
| 12 | SVG Draw Animation | `sections/Process.tsx` |
| 13 | MotionPath（データが軌道を流れる） | `sections/Process.tsx` |
| 14 | FLIP（カード→詳細展開） | `sections/Features.tsx` |
| 15 | Parallax | `Hero.tsx`（光の層）, `Showcase.tsx` |
| 16 | Horizontal Scroll（縦操作で横移動） | `sections/Showcase.tsx` |
| 17 | Inertia / Observer | `sections/Showcase.tsx`（velocityでskew）, scroll-snap |
| 18 | Lottie | `ui/LottiePlayer.tsx`（CTAで使用） |

---

## 🔧 差し替えガイド

### 1. コピー・数値・ラインナップを変える
すべて **`src/data/content.ts`** に集約しています。このファイルだけ編集すれば、製品名・キャッチコピー・課題・特徴・実績数値・ラインナップを変更できます。

### 2. 3Dモデルを差し替える
`src/components/three/ProductScene.tsx` の `buildPlaceholderProduct()` を置き換えます。GLTF を読み込む例：

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

new GLTFLoader().load('/models/product.glb', (gltf) => {
  group.add(gltf.scene); // 原点中心に配置すると回転が綺麗に決まります
});
```
`/public/models/product.glb` を置けば配信されます。PointLight の色は同ファイル上部の `colorA / colorB / colorC` で調整できます。

### 3. 商品画像を差し替える
`Showcase.tsx` 内のプレースホルダー（グラデーションのブロック）を `<img src="/images/xxx.png" />` に置き換えてください。`/public/images/` に画像を置けます。

### 4. Lottieアニメを差し替える
After Effects (Bodymovin) で書き出した JSON を `public/lottie/` に置き、`LottiePlayer` の `src` を差し替えます。例：`<LottiePlayer src="/lottie/complete.json" />`。

### 5. カラー / 余白 / フォント
`tailwind.config.js`（`colors`, `fontFamily`, `maxWidth.content`）と `src/index.css` で調整します。

---

## ♿ アクセシビリティ / パフォーマンス

- **`prefers-reduced-motion`** を全面尊重（`useReducedMotion` + CSS メディアクエリ）。アニメーションを停止し、3Dは自動回転を止め、Lottieは静止フレームを表示します。
- Three.js は `devicePixelRatio` を2に制限、画面外では `IntersectionObserver` でレンダリングを停止。
- Vite で three / gsap / lottie を別チャンクに分割し、初期表示を軽量化。
- 完全レスポンシブ。Pin / 横スクロールはモバイルでは無効化し、ネイティブ scroll-snap にフォールバックします。

---

## 📝 注意

ページ内のテキスト・数値・画像・3Dモデルはすべて**デモ用のダミー**です。実プロジェクトでは上記「差し替えガイド」に従って置き換えてください。
