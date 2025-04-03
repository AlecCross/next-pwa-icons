// pages/_document.js

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
          <link rel="icon" type="image/webp" sizes="32x32" href="/favicon.webp"/> {/* Змінили на favicon.webp */}
          <link rel="icon" type="image/webp" sizes="16x16" href="/icon-16.webp"/>
          <link rel="apple-touch-icon" href="/icon-192.webp"/>

          <meta property="og:type" content="website"/>
          <meta property="og:title" content="PWA-Icons"/>
          <meta property="og:description" content="A simple PWA for storing and converting icons"/>
          <meta property="og:image" content="/icon-512.webp"/>
          <meta property="og:image:type" content="image/webp"/>
          <meta property="og:image:width" content="512"/>
          <meta property="og:image:height" content="512"/>
          <meta property="og:url" content="https://next-pwa-icons.vercel.app"/>

          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content="PWA-Icons"/>
          <meta name="twitter:description" content="A simple PWA for storing and converting icons"/>
          <meta name="twitter:image" content="/icon-512.webp"/>

          <link rel="manifest" href="/manifest.json"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
