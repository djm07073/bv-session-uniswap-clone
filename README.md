# 프로젝트 세팅

`npm i`
`npx tailwindcss init -p`
```
/** tailwind.config.js 아래와 같이 수정**/
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Detail

1. https://vitejs.dev/guide/
2. [Wallet Connect Cloud](https://cloud.walletconnect.com/app)
3. [React로 Wallet Connect Modal 시작하기](https://docs.walletconnect.com/2.0/web3modal/react/about)
4. https://tailwindcss.com/docs/guides/vite(선택 사항)
5. https://www.alchemy.com/
