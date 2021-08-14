import { makeStyles } from '@material-ui/core';

import {
  useCallback,
  useState,
} from 'react';

import Header from '#/components/Header';
import EateryCardList from '#/components/EateryCardList';
import Template from '#/components/Template';
import {
  Eatery,
} from '#/types/Eatery';
import Util from '#/Util';

const useStyles = makeStyles({
  template: {
    overflowX: 'hidden',
  },
});

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

const Home = () => {
  const classes = useStyles();
  const [eateries, setEateries] = useState<Eatery[]>(() => EATERY_LIST);

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
    <Template className={classes.template}>
      <Header />
      <EateryCardList eateries={eateries} handleRemove={handleRemove} />
    </Template>
  );
};

export default Home;
