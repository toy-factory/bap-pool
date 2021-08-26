import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import Image from 'next/image';
import Divider from '@material-ui/core/Divider';

import ApiRequest from '#/ApiRequest';
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
    borderRadius: 8,
  },
  image: {
    backfaceVisibility: 'hidden',
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
  id: string;
  isLoading: boolean;
  data: EateryData;
  currentWidth: number;
}

const EateryCardFront = ({
  id,
  isLoading,
  data,
  currentWidth,
}: EateryCardFrontProps) => {
  const classes = useStyles();

  const handleButtonClick = useCallback(async (e) => {
    e.preventDefault();

    if (data.url == null) {
      // eslint-disable-next-line no-alert
      alert('주소를 찾을 수 없습니다.');
      return;
    }

    window.open(data.url);
    await ApiRequest.putEateryClickCount(id);
  }, [data.url, id]);

  return (
    <div
      className={classes.eateryCardFront}
    >
      <div
        className={classes.imageContainer}
        style={{
          minWidth: currentWidth / 3,
          maxWidth: currentWidth / 3,
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
              objectFit="contain"
              draggable={false}

            />
          )}
      </div>
      <Divider
        orientation="vertical"
        flexItem
      />
      <div className={classes.cardContents}>
        <div>
          <Typography variant="h5" component="h2">
            {isLoading ? <Skeleton /> : data.placeName}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {isLoading ? <Skeleton /> : `다른 바푸리가 ${data.click}번 클릭했어요.`}
          </Typography>
          <Typography variant="body2" component="p">
            {isLoading ? <Skeleton /> : `여기서부터 ${data.distance}m 만큼 떨어져 있어요.`}
          </Typography>
        </div>
        <div>
          <Button
            className={classes.button}
            fullWidth
            variant="contained"
            onClick={handleButtonClick}
            color="primary"
            disabled={isLoading}
          >
            {
              isLoading
                ? <Skeleton variant="rect" />
                : <Typography variant="button">지도에서 보기</Typography>
            }
          </Button>

        </div>
      </div>
    </div>
  );
};

export default EateryCardFront;
