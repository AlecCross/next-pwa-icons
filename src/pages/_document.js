import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Іконки */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" sizes="16x16" href="/icon-16.ico" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/icon-32.ico" />
        
        {/* Маніфест для PWA */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
