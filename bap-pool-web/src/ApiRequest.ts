import axios from 'axios';

import { EateryData } from '#/types/Eatery';

const ApiRequest = (() => {
  const apiClient = axios.create({
    baseURL: 'https://bappool.tk/api',
    timeout: 3000,
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
    async getEatery(id: string): Promise<Pick<EateryData, 'id' | 'click' | 'url' | 'thumbnailUrl'>> {
      const response = await apiClient.get(
        `/eateries/${id}`,
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
