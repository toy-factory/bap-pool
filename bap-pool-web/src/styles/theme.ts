import { createTheme } from '@material-ui/core';

import Colors from './Colors';

const theme = createTheme({
  palette: {
    primary: {
      main: Colors.primary,
    },
  },
  typography: {
    fontFamily: [
      'GmarketSansMedium',
      '-apple-system',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '4.5rem' },
    h2: { fontSize: '3.6rem' },
    h3: { fontSize: '2.6rem' },
    h4: { fontSize: '2.0rem' },
    h5: { fontSize: '1.8rem' },
    h6: { fontSize: '1.6rem' },
    subtitle1: { fontSize: '1.4rem' },
    subtitle2: { fontSize: '1rem' },
    button: { fontSize: '1.6rem' },
    body1: { fontSize: '1.6rem' },
    body2: { fontSize: '1.6rem' },
    caption: { fontSize: '1.2rem' },
    htmlFontSize: 16,
  },
});

export default theme;
