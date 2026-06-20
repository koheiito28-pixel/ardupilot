# 親子の水彩イラスト ヒーローセクション

HTML + CSS のみ（JSなし）で実装したLPヒーローセクションです。

## ファイル
- `index.html` — マークアップ
- `hero.css` — スタイル＋ `@keyframes` アニメーション
- `images/` — **動作確認用の仮プレースホルダー画像**（mother / baby / hand）

## 本番画像への差し替え
`images/mother.png` `images/baby.png` `images/hand.png` を実画像に置き換えるだけです。
3枚は同じキャンバスサイズ・透過PNGで、`object-position: bottom center` を基準に重なります。

## スマホで見る（GitHub Pages）
1. リポジトリの **Settings → Pages** を開く
2. **Source**: 「Deploy from a branch」
3. **Branch**: `claude/parent-child-hero-animation-vrksl3` / フォルダ `/(root)` を選択して **Save**
4. 数十秒後に公開URLが発行されます：
   `https://koheiito28-pixel.github.io/ardupilot/hero-lp/`
5. スマホのブラウザでそのURLを開いて確認

## アニメーション調整
`hero.css` の `:root` 変数でまとめて調整できます。
- `--sway-duration` 揺れの周期（既定 3.5s）
- `--sway-angle` 傾きの大きさ（既定 1.5deg）
- `--pat-duration` トントンの間隔（既定 1s）
- `--pat-distance` 上下の振幅（既定 4px）

`prefers-reduced-motion: reduce` の環境では揺れ・トントンを自動停止します。
