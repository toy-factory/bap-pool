import {
  makeStyles,
} from '@material-ui/core';
import {
  useCallback,
  useState,
  useEffect,
} from 'react';

import Header from '#/components/Header';
import EateryCardList from '#/components/EateryCardList';
import Template from '#/components/Template';
import Spinner from '#/components/Spinner';
import {
  Eatery,
  EateryData,
} from '#/types/Eatery';
import Util from '#/Util';
import useGeolocation from '#/hooks/useGeolocation';
import ApiRequest from '#/ApiRequest';

const useStyles = makeStyles({
  template: {
    overflowX: 'hidden',
  },
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SLEEP_TERMS_IN_MS = 700;

interface EntireEateries {
  data: EateryData;
  showing: boolean;
  showed: boolean;
}

const Home = () => {
  const classes = useStyles();
  const geolocation = useGeolocation();

  const [eateriesPool, setEateriesPool] = useState<EntireEateries[]>([]);
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchEateries = async ({ lat, lng }: {lat: number, lng: number}) => {
      let eateriesData: EateryData[] = [];
      setIsInitialLoading(true);
      try {
        eateriesData = await ApiRequest.getEateries({
          lat,
          lng,
        });
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('현재 서버와 연결이 올바르지 않습니다. 다음에 다시 접속해주세요.');
        return;
      } finally {
        setIsInitialLoading(false);
      }

      const entireEateriesData = eateriesData.map(
        (eatery, index) => ({
          data: { ...eatery, distance: Math.floor(eatery.distance) },
          showing: index < 5,
          showed: index < 5,
        }),
      );

      setEateriesPool(entireEateriesData);
      setEateries(
        entireEateriesData
          .filter(
            (entireEateryData) => entireEateryData.showing,
          ).map((eatery, index) => ({
            id: eatery.data.id,
            isFlipped: false,
            isLoading: false,
            order: index,
            data: eatery.data,
          })),
      );
    };

    if (geolocation == null) return;

    fetchEateries({ lat: geolocation.coords.latitude, lng: geolocation.coords.longitude });
  }, [geolocation]);

  const handleRemove = useCallback(async (id: string) => {
    const orderForRemovedCard = eateries.find((eatery) => eatery.data?.id === id)?.order ?? 0;
    const eateriesIndexForRemovedCard = eateries.findIndex((eatery) => eatery.data?.id === id);

    const makeEmptyCard = () => {
      setEateries((prevEateries) => {
        const removedEateries = [...prevEateries];
        removedEateries[eateriesIndexForRemovedCard] = {
          ...removedEateries[eateriesIndexForRemovedCard],
          isLoading: true,
        };
        return removedEateries;
      });
    };

    const updateReplacedEateryCard = async () => {
      const newUnshowedEateryIndex = eateriesPool.findIndex((eatery) => !eatery.showed);
      if (newUnshowedEateryIndex === -1) {
        // eslint-disable-next-line no-alert
        alert('더 불러올 수 있는 가게가 없어요!');
        return;
      }

      const newEateryDetailData = (
        await ApiRequest.getEatery(eateriesPool[newUnshowedEateryIndex].data.id)
      );

      setEateriesPool((prevEateriesPool) => {
        const replacedEateryIndex = prevEateriesPool.findIndex((eatery) => eatery.data?.id === id);
        const newEateriesPool = [...prevEateriesPool];
        newEateriesPool[replacedEateryIndex].showing = false;

        newEateriesPool[newUnshowedEateryIndex].showed = true;
        newEateriesPool[newUnshowedEateryIndex].showing = true;
        return newEateriesPool;
      });
      setEateries((prevEateries) => {
        const newEateries = [...prevEateries];

        newEateries[eateriesIndexForRemovedCard] = {
          id: eateriesPool[newUnshowedEateryIndex].data.id,
          data: {
            ...eateriesPool[newUnshowedEateryIndex].data,
            click: newEateryDetailData.click,
            url: newEateryDetailData.url,
            thumbnailUrl: newEateryDetailData.thumbnailUrl,
          },
          isFlipped: false,
          isLoading: false,
          order: orderForRemovedCard,
        };
        return newEateries;
      });
    };

    makeEmptyCard();
    await sleep(1000);
    await updateReplacedEateryCard();
  }, [eateries, eateriesPool]);

  const pickRandomEatery = useCallback(async () => {
    if (isPicking) return;
    setIsPicking(true);

    try {
      const newEateries = [...eateries];
      const orderZeroEateries = newEateries.map(
        (eatery) => ({ ...eatery, order: 0, isFlipped: true }),
      );
      setEateries(orderZeroEateries);
      await sleep(SLEEP_TERMS_IN_MS);

      const orderArray = Util.shuffleArray(Array(eateries.length).fill(0).map((_, index) => index));
      const newOrderEateries = orderZeroEateries.map(
        (eatery, index) => ({ ...eatery, order: orderArray[index] }),
      );
      setEateries(newOrderEateries);
      await sleep(SLEEP_TERMS_IN_MS);

      const [randomIndex] = Util.shuffleArray(orderArray);
      const oneFlippedEateries = [...newOrderEateries];
      oneFlippedEateries[randomIndex] = { ...oneFlippedEateries[randomIndex], isFlipped: false };
      setEateries(oneFlippedEateries);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsPicking(false);
    }
  }, [eateries, isPicking]);

  return (
    <Template className={classes.template}>
      <Header pickRandomEatery={pickRandomEatery} />
      { isInitialLoading
        ? (
          <Spinner
            color="secondary"
            text="가까운 가게를 불러오고 있어요."
          />
        )
        : (
          <EateryCardList
            eateries={eateries}
            handleRemove={handleRemove}
          />
        )}
    </Template>
  );
};

export default Home;
