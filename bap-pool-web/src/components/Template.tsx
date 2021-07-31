import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  main: {
    flexGrow: 1,
    [theme.breakpoints.up(640)]: {
      width: '50%',
      flexGrow: 0,
    },
  },
}));

interface TemplateProps {
  children: React.ReactNode;
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
