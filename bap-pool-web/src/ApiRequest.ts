import axios from 'axios';

import { EateryData } from './types/Eatery';

const ApiRequest = (() => {
  const apiClient = axios.create({
    baseURL: 'http://13.125.213.210:8080/api',
    timeout: 1000,
  });

  return {
    async getEateries({ lat, lng }: {lat: number, lng: number}): Promise<EateryData[]> {
      const response = await apiClient.get(
        '/eateries',
        {
          params: { lat, lng },
        },
      );
      console.log(response.data);
      return response.data;
    },
  };
})();

export default ApiRequest;
