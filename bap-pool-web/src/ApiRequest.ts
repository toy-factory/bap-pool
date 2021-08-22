import axios from 'axios';

import { EateryData } from '#/types/Eatery';

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
      return response.data;
    },
    async putEateryClickCount(id: string): Promise<void> {
      const response = await apiClient.put(
        `/eateries/click/${id}`,
      );
      return response.data;
    },
  };
})();

export default ApiRequest;
