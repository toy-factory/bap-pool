import { createTheme } from '@material-ui/core';

const theme = createTheme({
  typography: {
    fontFamily: [
      'GmarketSansMedium',
      '-apple-system',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
