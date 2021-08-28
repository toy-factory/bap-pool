import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    gap: '2rem',
  },
  text: {
    whiteSpace: 'pre-line',
  },
});

interface SpinnerProps extends CircularProgressProps {
  text?: string;
}

const Spinner = ({ text, ...props }: SpinnerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.spinnerContainer}>
      <CircularProgress size="10rem" {...props} />
      {text && <Typography align="center" className={classes.text}>{text}</Typography>}
    </div>
  );
};

export default Spinner;
