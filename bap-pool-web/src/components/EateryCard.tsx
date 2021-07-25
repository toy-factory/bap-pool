import React, {
  HTMLAttributes,
  useState,
  useCallback,
} from 'react';
import Image from 'next/image';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import Colors from '#/styles/Colors';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '12rem',
    boxShadow: `1px 1px 1px 1px ${Colors.gray}`,
    position: 'relative',
    userSelect: 'none',
    cursor: 'grab',
    touchAction: 'none',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6rem',
    position: 'relative',
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

interface EateryCardProps {
  thumbnail: string;
  placeName: string;
  click: number;
  distance: number;
}

const EateryCard = ({
  thumbnail, placeName, click, distance, ...otherProps
}: EateryCardProps & HTMLAttributes<HTMLDivElement>) => {
  const classes = useStyles();
  const [deltaX, setDeltaX] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = useCallback((e) => {
    const [lastTouch] = e.touches;
    setStartX(lastTouch.screenX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    const [lastTouch] = e.touches;
    setDeltaX(lastTouch.screenX - startX);
  }, [startX]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setStartX(0);
    setDeltaX(0);
  }, []);

  const onDragStart = useCallback(() => {

  }, []);

  return (
    <Card
      style={{ transform: `translateX(${deltaX}px)` }}
      className={classes.root}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={onDragStart}
    >
      <div className={classes.imageContainer}>
        <Image src={thumbnail} alt="thumbnail" layout="fill" objectFit="contain" draggable={false} />
      </div>
      <div className={classes.cardContents}>
        <Typography variant="h5" component="h2">
          {placeName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {`다른 바푸리가 ${click}번 클릭했어요.`}
        </Typography>
        <Typography variant="body2" component="p">
          {`${distance}m 거리에 있습니다.`}
        </Typography>
      </div>
    </Card>
  );
};

export default EateryCard;
