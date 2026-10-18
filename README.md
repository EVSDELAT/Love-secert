# 炫炫's Secret｜戀愛秘語

最初為了確定彼此的愛情而打造的戀愛秘語 — 屬於炫炫和奈奈的兩人私密空間。

## 這是什麼

這是一個專屬於兩個人的私密數位空間：以密碼學守護的訊息與紀錄平台，只有知道密語的人才能開啟。從確定彼此心意的那一刻起，重要的約定、回憶與悄悄話，都鎖在這個只有兩人能進入的地方。

## 功能

- **密語驗證開門儀式**：輸入兩人約定的密語才能進入，充滿驚喜的互動流程
- **端到端加密**：AES-GCM 加密（PBKDF2 十萬次迭代衍生金鑰），私密訊息與紀錄只有兩人能解開
- **紀念與驚喜**：禮物、紀念日小儀式、專屬互動
- **頂級視覺**：雙魚座主題設計，framer-motion 流暢動畫
- **PWA**：可安裝到手機桌面，離線也能開啟

## 技術

- React 18 + Vite
- framer-motion、lucide-react
- Web Crypto API（PBKDF2 + AES-GCM）

## 開發

```bash
npm install
npm run dev      # 本地開發
npm run build    # 打包
npm run deploy   # 發布到 GitHub Pages
```

網站發布於 <https://EVSDELAT.github.io/Love-secert>。
