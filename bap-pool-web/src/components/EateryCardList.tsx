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
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    margin: '1rem 0',
  },
});

interface EateryCardListProps {
  eateries : Eatery[];
  handleRemove: (id: string) => Promise<void>;
}
const EateryCardList = ({ eateries, handleRemove } : EateryCardListProps) => {
  const classes = useStyles();

  const eateryCardListRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classes.list} ref={eateryCardListRef}>
      {eateries.map((eatery) => (
        <EateryCard
          key={eatery.id}
          cardId={eatery.id}
          data={eatery.data}
          handleRemove={handleRemove}
          isFlipped={false}
        />
      ))}
    </div>
  );
};

export default EateryCardList;
