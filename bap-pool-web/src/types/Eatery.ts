export interface EateryData {
  id: string;
  placeName: string;
  category: string;
  thumbnailUrl: string | null;
  distance: number;
  click: number;
  types: string[];
  url: string | null;
}

export interface Eatery {
  id: string;
  order: number;
  isLoading: boolean;
  isFlipped: boolean;
  data: EateryData;
}
