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

interface HeaderProps {
  pickRandomEatery: () => Promise<void>;
}

const Header = ({ pickRandomEatery }: HeaderProps) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.header}>
        <div className={classes.title}>
          <Typography variant="h3">
            밥풀
          </Typography>
          <Typography variant="caption">
            &quot;뭐 먹지?&quot; 결정장애 당신을 위한 5초, 밥풀
          </Typography>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={pickRandomEatery}
        >
          <Typography>골라줘!</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
