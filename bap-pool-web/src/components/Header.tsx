import React from 'react';
import {
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    padding: '0.5rem 1rem',
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.header}>
          <div className={classes.title}>
            <Typography variant="h3">
              밥풀
            </Typography>
            <Typography variant="caption">
              뭐먹지? 우유부단한 그대들을 위한 5초
            </Typography>
          </div>
          <Button variant="contained" color="secondary">
            <Typography>골라줘!</Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
