import {
  ReactNode,
  forwardRef,
} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card, { CardProps } from '@material-ui/core/Card';

import Colors from '#/styles/Colors';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    boxShadow: `1px 1px 1px 1px ${Colors.gray}`,
    position: 'relative',
    userSelect: 'none',
    touchAction: 'none',
    transition: 'transform 0.1s ease',
    overflow: 'hidden',
  },
});

interface EateryCardBaseProps extends CardProps {
  children: ReactNode;
}

// eslint-disable-next-line react/display-name
const EateryCardBase = forwardRef(({ children, ...props }: EateryCardBaseProps, ref) => {
  const classes = useStyles();

  return (
    <Card
      ref={ref}
      className={[props.className ?? '', classes.card].join(' ')}
      {...props}
    >
      {children}
    </Card>
  );
});

export default EateryCardBase;
