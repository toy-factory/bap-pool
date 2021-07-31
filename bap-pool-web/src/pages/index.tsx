import { makeStyles } from '@material-ui/core';

import Header from '#/components/Header';
import EateryCardList from '#/components/EateryCardList';
import Template from '#/components/Template';

const useStyles = makeStyles({
  template: {
    overflowX: 'hidden',
  },
});

const Home = () => {
  const classes = useStyles();
  return (
    <Template className={classes.template}>
      <Header />
      <EateryCardList />
    </Template>
  );
};

export default Home;
