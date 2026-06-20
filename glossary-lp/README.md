# 動く用語集 — Modern Web Design & Motion（リファレンスLP）

「モダンWeb用語集」に載っている技術を、**読む**だけでなく**その場で動かして体験**できる形に
可視化したランディングページです。各カードは「用語そのもの」が動いて、機能を解説します。
今後のLP制作の **指標（ベンチマーク／テンプレート）** として流用してください。

## 特徴

- **依存ライブラリゼロ** — 素のHTML / CSS / JavaScript のみ。CDNもビルドも不要、そのまま開けます。
- **用語が動く** — 70以上の用語を6レベルで掲載し、主要な技術はライブデモで実演。
- **指示例つき** — 制作者やAIへ渡す「指示の言語化」を意識した文言。
- **アクセシビリティ配慮** — `prefers-reduced-motion` でアニメを抑制、キーボード操作・aria対応。

## 使い方（プレビュー）

ビルド不要。ブラウザで `index.html` を開くだけです。

```bash
# どちらでもOK
open glossary-lp/index.html              # macOS
xdg-open glossary-lp/index.html          # Linux

# もしくは簡易サーバ経由（推奨）
cd glossary-lp && python3 -m http.server 8000
# → http://localhost:8000
```

## ファイル構成

```
glossary-lp/
├── index.html      # 構造とコンテンツ（6レベルの用語）
├── css/style.css   # デザインシステム＋全デモのスタイル
├── js/main.js      # インタラクション（依存なし・モジュール分割）
└── README.md
```

## 収録している実装パターン（= LP制作の指標）

| カテゴリ | 実装している技術 |
|---|---|
| 環境演出 | Gradient Mesh / Noise・Grain / Ambient Motion / Light Bloom |
| 入口 | Loader・Preloader / Hero / Custom Cursor / Progress Indicator |
| スクロール | Smooth Scroll / Parallax / Scroll-driven / Pinned + Horizontal / Scrollytelling / Sticky Stack / Scroll Snap |
| 出現 | Fade-in / Reveal / Mask / Stagger / Text Split / Clip-Wipe / Counter |
| ホバー | Magnetic Button / Tilt 3D / Hover Reveal / Spotlight / Micro Interaction |
| 物理 | Spring・Bounce / Inertia・Momentum / Elastic / Easing |
| 質感 | Glassmorphism / Skeuomorphism / Brutalism / Gooey / Morph / SVG Morphing |
| UI状態 | Accordion / Skeleton / Toast / Page Transition / Dark Mode 切替 |

## カスタマイズの起点

- **配色・余白・角丸** … `css/style.css` 冒頭の `:root` トークンを変更。
- **テーマ** … `[data-theme="light"]` のトークンを編集。`<body data-theme="dark">` で初期値切替。
- **動きの強弱** … `--ease` / `--ease-spring` と各 `@keyframes`、JSの `strength` 値で調整。

> 出典：「モダンWeb用語集」を、実装で可視化したリファレンスLP。
> 各セクションは独立しているため、必要な部分だけ切り出して新規LPに移植できます。
