import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Image from 'next/image';

import { EateryData } from '#/types/Eatery';

const useStyles = makeStyles({
  removableCard: {
    flexGrow: 1,
    paddingTop: 0,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6rem',
    position: 'relative',
  },
  image: {
    backfaceVisibility: 'hidden',
  },
  cardContents: {
    padding: '1.2rem',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface EateryCardFrontProps {
  data?: EateryData;
}

const EateryCardFront = ({
  data,
}: EateryCardFrontProps) => {
  const classes = useStyles();

  return (
    <div
      className={classes.removableCard}
    >
      <div className={classes.imageContainer}>
        {data == null
          ? <Skeleton variant="rect" width="100%" height="100%" />
          : (
            <Image
              className={classes.image}
              src={data.thumbnail}
              alt="thumbnail"
              layout="fill"
              objectFit="contain"
              draggable={false}
            />
          )}
      </div>
      <div className={classes.cardContents}>
        <Typography variant="h5" component="h2">
          {data == null ? <Skeleton /> : data.placeName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {data == null ? <Skeleton /> : `다른 바푸리가 ${data.click}번 클릭했어요.`}
        </Typography>
        <Typography variant="body2" component="p">
          {data == null ? <Skeleton /> : `${data.distance}m 거리에 있습니다.`}
        </Typography>
      </div>
    </div>
  );
};

export default EateryCardFront;
