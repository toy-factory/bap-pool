import makeStyles from '@material-ui/core/styles/makeStyles';
import Image from 'next/image';

const useStyles = makeStyles({
  eateryCardBack: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
});

const EateryCardBack = () => {
  const classes = useStyles();

  return (
    <div className={classes.eateryCardBack}>
      <Image
        src="/bapoori.png"
        alt="thumbnail"
        layout="fill"
        objectFit="contain"
        draggable={false}
      />
    </div>
  );
};

export default EateryCardBack;
