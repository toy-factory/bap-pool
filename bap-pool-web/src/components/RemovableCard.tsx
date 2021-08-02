import {
  ReactNode,
} from 'react';
import {
  Card,
  makeStyles,
  useTheme,
} from '@material-ui/core';

import Colors from '#/styles/Colors';
import useRemovableEvents from '#/hooks/useRemovableEvents';

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

  const { deltaX, ...removableEvents } = useRemovableEvents({
    threshold: cardWidth / 2,
    onRemove: swipeCallback,
  });

  return (
    <div
      style={deltaX !== 0 ? {
        backgroundColor: theme.palette.error.main,
        opacity: 0.5,
        transition: 'opacity 0.2s ease',
      } : undefined}
    >
      <Card
        style={{ transform: `translateX(${deltaX}px)`, cursor: disabled ? 'default' : 'grab' }}
        className={[className ?? '', classes.card].join(' ')}
        {...(disabled ? {} : removableEvents)}
      >
        {children}
      </Card>
    </div>
  );
};

export default RemovableCard;
