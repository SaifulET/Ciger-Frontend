// pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add any additional head content here */}
        </Head>
        <body>
          {/* Add the <noscript> tag for users with JavaScript disabled */}
          <noscript>
            <meta http-equiv="refresh" content="0;url=https://agechecker.net/noscript" />
          </noscript>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
