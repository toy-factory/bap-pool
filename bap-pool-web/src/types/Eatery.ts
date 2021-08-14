export interface EateryData {
  thumbnail: string;
  placeName: string;
  click: number;
  distance: number;
}

export interface Eatery {
  id: string;
  data?: EateryData;
}
