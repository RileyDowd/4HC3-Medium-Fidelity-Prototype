export enum NoiseLevel {
  SILENT = 'Silent',
  QUIET = 'Quiet',
  MODERATE = 'Moderate',
  LIVELY = 'Lively'
}

export enum PlaceType {
  LIBRARY = 'Library',
  CAFE = 'Cafe',
  OUTDOOR = 'Outdoor',
  LOUNGE = 'Lounge',
  CLASSROOM = 'Classroom'
}

export interface Review {
  id: string;
  placeId: string;
  userName: string;
  rating: number;
  text: string;
  timestamp: number;
}

export interface StudyPlace {
  id: string;
  name: string;
  type: PlaceType;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  noiseLevel: NoiseLevel;
  hasOutlets: boolean;
  hasWifi: boolean;
  hasFood: boolean;
  isOpenLate: boolean;
  isCrowded: boolean; // Dynamic status mock
  reviews: Review[];
}

export interface FilterState {
  searchQuery: string;
  types: PlaceType[];
  noiseLevels: NoiseLevel[];
  hasOutlets: boolean;
  isOpenLate: boolean;
}