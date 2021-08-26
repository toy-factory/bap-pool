import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
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
      {text && <Typography>{text}</Typography>}
    </div>
  );
};

export default Spinner;
