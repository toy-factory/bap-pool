import { makeStyles } from '@material-ui/core';
import { useCallback } from 'react';

import EateryCardFront from './EateryCardFront';
import EateryCardBack from './EateryCardBack';
import { EateryData } from '#/types/Eatery';
import RemovableCard from './RemovableCard';

const useStyles = makeStyles({
  flipCard: {
    width: '100%',
    height: '200px',
    perspective: 1000,
    userSelect: 'none',
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
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  flipCardBack: {
    transform: 'rotateY(180deg)',
  },
});

interface EateryCardProps {
  cardId: string;
  handleRemove: (id: string) => Promise<void>;
  isFlipped: boolean;
  data?: EateryData;
}

const EateryCard = ({
  cardId,
  data,
  isFlipped,
  handleRemove,
}: EateryCardProps) => {
  const classes = useStyles();

  const swipeCallback = useCallback(async () => {
    await handleRemove(cardId);
  }, [handleRemove, cardId]);

  return (
    <RemovableCard
      className={classes.flipCard}
      swipeCallback={swipeCallback}
      disabled={data == null || isFlipped}
    >
      <div className={classes.flipCardInner} style={{ transform: `rotateY(${isFlipped ? '180' : '0'}deg)` }}>
        <div
          className={classes.flipCardCommon}
        >
          <EateryCardFront
            data={data}
          />
        </div>
        <div
          className={[classes.flipCardCommon, classes.flipCardBack].join(' ')}
        >
          <EateryCardBack />
        </div>
      </div>
    </RemovableCard>
  );
};

export default EateryCard;
