import {
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  makeStyles,
} from '@material-ui/core';

import EateryCard from './EateryCard';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    margin: '1rem 0',
  },
});

const EATERY_LIST = [
  {
    id: 1,
    data: {
      thumbnail: '/static/bapoori.png',
      placeName: '원래는',
      click: 12,
      distance: 123,
    },
  },
  {
    id: 2,
    data: {
      thumbnail: '/static/bapoori.png',
      placeName: '원래는 삼겹살',
      click: 12,
      distance: 123,
    },
  },
  {
    id: 3,
    data: {
      thumbnail: '/static/bapoori.png',
      placeName: '원래는 삼겹살 집을',
      click: 12,
      distance: 123,
    },
  },
  {
    id: 4,
    data: {
      thumbnail: '/static/bapoori.png',
      placeName: '원래는 삼겹살 집을 하려고',
      click: 12,
      distance: 123,
    },
  },
  {
    id: 5,
    data: {
      thumbnail: '/static/bapoori.png',
      placeName: '원래는 삼겹살 집을 하려고 했었다.',
      click: 12,
      distance: 123,
    },
  },
];

const EateryCardList = () => {
  const classes = useStyles();
  const [eateries, setEateries] = useState(() => EATERY_LIST);

  return (
    <div className={classes.root}>
      {eateries.map((eatery) => (
        <EateryCard
          key={eatery.id}
          {...eatery.data}
        />
      ))}
    </div>
  );
};

export default EateryCardList;
