import {
  useRef,
} from 'react';
import {
  makeStyles,
} from '@material-ui/core';

import EateryCard from './EateryCard/EateryCard';
import { Eatery } from '#/types/Eatery';

const useStyles = makeStyles({
  list: {
    position: 'relative',
    perspective: 1000,
    transformStyle: 'preserve-3d',
    '& > li': {
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'transform 0.5s ease',
      width: '100%',
    },
  },
});

interface EateryCardListProps {
  eateries : Eatery[];
  handleRemove: (id: string) => Promise<void>;
}

const GAP_HEIGHT_PERCENT = 5;
const HEIGHT_PER_CARD_PERCENT = 100;

const EateryCardList = ({ eateries, handleRemove } : EateryCardListProps) => {
  const classes = useStyles();

  const eateryCardListRef = useRef<HTMLUListElement>(null);

  return (
    <ul className={classes.list} ref={eateryCardListRef}>
      {eateries.map((eatery) => (
        <EateryCard
          style={{ transform: `translateY(${eatery.order * (HEIGHT_PER_CARD_PERCENT + GAP_HEIGHT_PERCENT)}%)` }}
          key={eatery.id}
          cardId={eatery.id}
          data={eatery.data}
          handleRemove={handleRemove}
          isFlipped={eatery.isFlipped}
        />
      ))}
    </ul>
  );
};

export default EateryCardList;
