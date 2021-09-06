import React from 'react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/core';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta charSet="utf-8" />
          <meta name="description" content={'"뭐 먹지?" 결정장애 당신을 위한 5초, 밥풀'} />
          <meta property="og:title" content="밥풀" />
          <meta property="og:site_name" content="밥풀" />
          <meta property="og:description" content={'"뭐 먹지?" 결정장애 당신을 위한 5초, 밥풀'} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/ogImage.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
