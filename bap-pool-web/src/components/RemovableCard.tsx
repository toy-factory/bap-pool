import {
  CSSProperties,
  ReactNode,
} from 'react';
import {
  useTheme,
} from '@material-ui/core';

import useRemovableEvents from '#/hooks/useRemovableEvents';
import EateryCardBase from './Card/EateryCardBase';

interface RemovableCardProps {
  cardWidth: number;
  swipeCallback: () => void;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
}

const RemovableCard = ({
  cardWidth,
  swipeCallback,
  children,
  style,
  className,
  disabled = false,
}: RemovableCardProps) => {
  const theme = useTheme();

  const { deltaX, ...removableEvents } = useRemovableEvents({
    threshold: cardWidth / 2,
    onRemove: swipeCallback,
  });

  return (
    <div
      style={{
        ...style,
        ...(deltaX !== 0 ? {
          backgroundColor: theme.palette.error.main,
          opacity: 0.5,
          transition: 'opacity 0.2s ease',
        } : {}),
      }}
    >
      <EateryCardBase
        style={{ transform: `translateX(${deltaX}px)`, cursor: disabled ? 'default' : 'grab' }}
        className={className}
        {...(disabled ? {} : removableEvents)}
      >
        {children}
      </EateryCardBase>
    </div>
  );
};

export default RemovableCard;
