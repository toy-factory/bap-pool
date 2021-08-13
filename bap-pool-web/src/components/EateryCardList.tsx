import {
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  makeStyles,
} from '@material-ui/core';

import { EateryData } from '#/types/Eatery';
import Util from '#/Util';
import EateryCard from './EateryCard/EateryCard';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    margin: '1rem 0',
  },
});

interface Eatery {
  id: string;
  data?: EateryData;
}

const EATERY_LIST: Eatery[] = [
  {
    id: '1',
    data: {
      thumbnail: '/bapoori.png',
      placeName: '원래는',
      click: 12,
      distance: 123,
    },
  },
  {
    id: '2',
    data: {
      thumbnail: '/bapoori.png',
      placeName: '원래는 삼겹살',
      click: 12,
      distance: 123,
    },
  },
  {
    id: '3',
    data: {
      thumbnail: '/bapoori.png',
      placeName: '원래는 삼겹살 집을',
      click: 12,
      distance: 123,
    },
  },
  {
    id: '4',
    data: {
      thumbnail: '/bapoori.png',
      placeName: '원래는 삼겹살 집을 하려고',
      click: 12,
      distance: 123,
    },
  },
  {
    id: '5',
    data: {
      thumbnail: '/bapoori.png',
      placeName: '원래는 삼겹살 집을 하려고 했었다',
      click: 12,
      distance: 123,
    },
  },
];

const EateryCardList = () => {
  const classes = useStyles();
  const [eateries, setEateries] = useState<Eatery[]>(() => EATERY_LIST);

  const eateryCardListRef = useRef<HTMLDivElement>(null);

  const getEatery = useCallback(async () => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Util.getRandomId(), data: EATERY_LIST[0].data });
    }, 1000);
  }), []);

  const handleRemove = useCallback(async (id: string) => {
    const indexToRemove = eateries.findIndex((eatery) => eatery.id === id);
    if (indexToRemove === -1) return;

    const removedEateries = [...eateries];
    removedEateries[indexToRemove] = { id: eateries[indexToRemove].id, data: undefined };
    setEateries(removedEateries);

    const newEatery = await getEatery();
    setEateries((prevEateries) => {
      const newEateries = [...prevEateries];
      newEateries[indexToRemove] = newEatery as Eatery;
      return newEateries;
    });
  }, [eateries, getEatery]);

  return (
    <div className={classes.list} ref={eateryCardListRef}>
      {eateries.map((eatery) => (
        <EateryCard
          key={eatery.id}
          cardId={eatery.id}
          data={eatery.data}
          handleRemove={handleRemove}
          isFlipped={Number(eatery.id) === 2}
        />
      ))}
    </div>
  );
};

export default EateryCardList;
