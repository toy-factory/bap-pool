import { makeStyles } from '@material-ui/core';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up(640)]: {
      width: '50%',
      flexGrow: 0,
    },
  },
}));

interface TemplateProps {
  children: ReactNode;
  className?: string;
}

const Template = ({ children, className }: TemplateProps) => {
  const classes = useStyles();

  return (
    <div className={[className, classes.root].join(' ')}>
      <main className={classes.main}>
        {children}
      </main>
    </div>
  );
};

export default Template;
