import {
  CSSProperties,
  ReactNode,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core';

import useRemovableEvents from '#/hooks/useRemovableEvents';
import EateryCardBase from './EateryCardBase';

interface RemovableCardProps {
  swipeCallback: () => Promise<void>;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
}

const useStyles = makeStyles({
  removableDiv: {
    height: '100%',
  },
});

const RemovableCard = ({
  swipeCallback,
  children,
  style,
  className,
  disabled = false,
}: RemovableCardProps) => {
  const theme = useTheme();
  const classes = useStyles();

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(360);

  useEffect(() => {
    if (cardRef.current == null) return;

    setCardWidth(cardRef.current.clientWidth);
  }, []);

  const { deltaX, ...removableEvents } = useRemovableEvents({
    threshold: cardWidth / 2,
    onRemove: swipeCallback,
  });

  return (
    <div
      style={{
        ...style,
        ...(deltaX !== 0 ? {
          backgroundColor: theme.palette.error.light,
          opacity: 0.5,
          transition: 'opacity 0.2s ease',
        } : {}),
      }}
      className={classes.removableDiv}
    >
      <EateryCardBase
        ref={cardRef}
        style={{ transform: `translateX(${deltaX}px)`, cursor: disabled ? 'default' : 'grab', transition: 'transform 0.1s ease' }}
        className={className}
        {...(disabled ? {} : removableEvents)}
      >
        {children}
      </EateryCardBase>
    </div>
  );
};

export default RemovableCard;
