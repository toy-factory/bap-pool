import {
  useState,
  useCallback,
  useRef,
  MouseEvent,
  TouchEvent,
  ReactNode,
} from 'react';
import {
  Card,
  makeStyles,
  useTheme,
} from '@material-ui/core';

import Colors from '#/styles/Colors';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '12rem',
    boxShadow: `1px 1px 1px 1px ${Colors.gray}`,
    position: 'relative',
    userSelect: 'none',
    touchAction: 'none',
    transition: 'transform 0.1s ease',
    overflow: 'hidden',
  },
  grab: {
    cursor: 'grab',
  },
});

interface RemovableCardProps {
  cardWidth: number;
  swipeCallback: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const RemovableCard = ({
  cardWidth,
  swipeCallback,
  children,
  className,
  disabled,
}: RemovableCardProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [deltaX, setDeltaX] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].screenX);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setDeltaX(e.touches[0].screenX - startX);
  }, [startX]);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(deltaX) > Math.round(cardWidth / 2)) {
      swipeCallback();
      // onDelete();
    }
    setStartX(0);
    setDeltaX(0);
  }, [deltaX, cardWidth, swipeCallback]);

  const draggingItemRef = useRef<MouseEvent<HTMLDivElement>>();

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    draggingItemRef.current = e;
    setStartX(e.screenX);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (draggingItemRef.current == null) {
      return;
    }
    setDeltaX(e.screenX - startX);
  }, [startX]);

  const resetMouseEvent = useCallback(() => {
    draggingItemRef.current = undefined;
    setStartX(0);
    setDeltaX(0);

    if (Math.abs(deltaX) > Math.round(cardWidth / 2)) {
      swipeCallback();
    }
  }, [deltaX, cardWidth, swipeCallback]);

  const handleMouseUp = useCallback(() => {
    resetMouseEvent();
  }, [resetMouseEvent]);

  const handleMouseLeave = useCallback(() => {
    resetMouseEvent();
  }, [resetMouseEvent]);

  if (disabled) {
    return (
      <Card
        className={[className ?? '', classes.card].join(' ')}
      >
        {children}
      </Card>
    );
  }

  return (
    <div
      style={deltaX !== 0 ? {
        backgroundColor: theme.palette.error.main,
        opacity: 0.5,
        transition: 'opacity 0.2s ease',
      } : undefined}
    >
      <Card
        style={{ transform: `translateX(${deltaX}px)` }}
        className={[className ?? '', classes.grab, classes.card].join(' ')}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Card>
    </div>
  );
};

export default RemovableCard;
