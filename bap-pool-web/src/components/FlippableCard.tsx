import { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  flipCard: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '200px',
    perspective: 1000,
  },
  flipCardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.8s',
    transformStyle: 'preserve-3d',
  },
  flipCardCommon: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    width: '100%',
    height: '200px',
  },
  flipCardFront: {
    transform: 'rotateX(0deg)',
  },
  flipCardBack: {
    transform: 'rotateY(180deg)',
  },
});

interface FlippableCardProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
}

const FlippableCard = ({ front, back, isFlipped }: FlippableCardProps) => {
  const classes = useStyles();

  return (
    <div className={classes.flipCard}>
      <div className={classes.flipCardInner} style={{ transform: `rotateY(${isFlipped ? '180' : '0'}deg)` }}>
        <div
          style={isFlipped ? { transform: 'rotateY(180deg)' } : undefined}
          className={[classes.flipCardFront, classes.flipCardCommon].join(' ')}
        >
          {front}
        </div>
        <div
          style={isFlipped ? undefined : { transform: 'rotateY(180deg)' }}
          className={[classes.flipCardFront, classes.flipCardCommon].join(' ')}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
