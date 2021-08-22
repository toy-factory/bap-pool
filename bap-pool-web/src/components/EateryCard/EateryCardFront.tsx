import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import Image from 'next/image';

import { EateryData } from '#/types/Eatery';

const useStyles = makeStyles({
  eateryCardFront: {
    flexGrow: 1,
    paddingTop: 0,
    display: 'flex',
  },
  imageContainer: {
    display: 'flex',
    position: 'relative',
  },
  image: {
    backfaceVisibility: 'hidden',
    borderRadius: 8,
  },
  cardContents: {
    padding: '1.2rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-end',
  },
});

interface EateryCardFrontProps {
  isLoading: boolean;
  data: EateryData;
  currentWidth: number;
}

const EateryCardFront = ({
  isLoading,
  data,
  currentWidth,
}: EateryCardFrontProps) => {
  const classes = useStyles();

  const handleButtonClick = useCallback((e) => {
    e.preventDefault();

    if (data.url == null) {
      // eslint-disable-next-line no-alert
      alert('주소를 찾을 수 없습니다.');
      return;
    }

    window.open(data.url);
  }, [data.url]);

  return (
    <div
      className={classes.eateryCardFront}
    >
      <div
        className={classes.imageContainer}
        style={{
          minWidth: currentWidth / 3,
          minHeight: '100%',
        }}
      >
        {isLoading
          ? <Skeleton variant="rect" width="100%" height="100%" />
          : (
            <Image
              className={classes.image}
              src={data.thumbnailUrl ?? '/bapoori.png'}
              alt="thumbnail"
              layout="fill"
              objectFit="fill"
              draggable={false}
            />
          )}
      </div>
      <div className={classes.cardContents}>
        <div>
          <Typography variant="h5" component="h2">
            {isLoading ? <Skeleton /> : data.placeName}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {isLoading ? <Skeleton /> : `다른 바푸리가 ${data.click}번 클릭했어요.`}
          </Typography>
          <Typography variant="body2" component="p">
            {isLoading ? <Skeleton /> : `${data.distance}m 거리에 있습니다.`}
          </Typography>
        </div>
        <Button className={classes.button} fullWidth variant="contained" onClick={handleButtonClick} color="primary">
          <Typography variant="button">지도에서 보기</Typography>
        </Button>
      </div>
    </div>
  );
};

export default EateryCardFront;
