import React from 'react';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import {
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';

import theme from '#/styles/theme';
import './global.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ThemeProvider>
  </>
);

export default MyApp;
