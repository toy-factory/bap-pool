import {
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  makeStyles,
  Typography,
} from '@material-ui/core';
import Image from 'next/image';

import EateryCard from './EateryCard/EateryCard';
import { Eatery } from '#/types/Eatery';
import useWindowSize from '#/hooks/useWindowSize';

const useStyles = makeStyles({
  noEateries: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    gap: '1.5rem',
  },
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
  const { width } = useWindowSize();
  const [cardWidth, setCardWidth] = useState(360);

  const cardListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setCardWidth(cardListRef.current?.clientWidth ?? 360);
  }, [width]);

  if (eateries.length === 0) {
    return (
      <div className={classes.noEateries}>
        <Image width="300" height="300" alt="papoori" src="/papoori.png" />
        <Typography>현재 영업중인 가게를 찾을 수 없어요.</Typography>
        <Typography>다음에 다시 시도해주세요!</Typography>
      </div>
    );
  }

  return (
    <ul className={classes.list} ref={cardListRef}>
      {eateries.map((eatery) => (
        <EateryCard
          style={{ transform: `translateY(${eatery.order * (HEIGHT_PER_CARD_PERCENT + GAP_HEIGHT_PERCENT)}%)` }}
          key={eatery.id}
          id={eatery.id}
          data={eatery.data}
          isLoading={eatery.isLoading}
          handleRemove={handleRemove}
          isFlipped={eatery.isFlipped}
          currentWidth={cardWidth}
        />
      ))}
    </ul>
  );
};

export default EateryCardList;
