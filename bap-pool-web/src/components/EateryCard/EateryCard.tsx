import {
  useCallback,
  DetailedHTMLProps,
  LiHTMLAttributes,
  useRef,
  useEffect,
} from 'react';
import { makeStyles } from '@material-ui/core';

import EateryCardFront from './EateryCardFront';
import EateryCardBack from './EateryCardBack';
import { EateryData } from '#/types/Eatery';
import RemovableCard from './RemovableCard';

import usePrevious from '#/hooks/usePrevious';

const useStyles = makeStyles({
  eateryCard: {
    listStyle: 'none',
  },
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

interface EateryCardProps
  extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  cardId: string;
  handleRemove: (id: string) => Promise<void>;
  isFlipped?: boolean;
  data?: EateryData;
}

const EateryCard = ({
  cardId,
  data,
  isFlipped = false,
  handleRemove,
  ...props
}: EateryCardProps) => {
  const classes = useStyles();

  const cardRef = useRef<HTMLLIElement | null>(null);
  const previousIsFlipped = usePrevious(isFlipped);

  const swipeCallback = useCallback(async () => {
    await handleRemove(cardId);
  }, [handleRemove, cardId]);

  useEffect(() => {
    if (cardRef.current == null) return;
    if (previousIsFlipped && !isFlipped) {
      cardRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isFlipped, previousIsFlipped]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <li {...props} className={classes.eateryCard} ref={cardRef}>
      <RemovableCard
        className={classes.flipCard}
        swipeCallback={swipeCallback}
        disabled={data == null || isFlipped}
      >
        <div className={classes.flipCardInner} style={{ transform: `rotateY(${isFlipped ? '180' : '0'}deg)` }}>
          <div className={classes.flipCardCommon}>
            <EateryCardFront data={data} />
          </div>
          <div className={[classes.flipCardCommon, classes.flipCardBack].join(' ')}>
            <EateryCardBack />
          </div>
        </div>
      </RemovableCard>
    </li>
  );
};

export default EateryCard;
