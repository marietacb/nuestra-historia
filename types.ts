
export type Category = 'Viaje' | 'Comida' | 'Cine' | 'Hito' | 'Tometa';

export interface Memory {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  imageUrls: string[];
  category: Category;
  isFavorite?: boolean;
  km?: number;
  movie?: string;
  ratingMaria?: number;
  ratingGuillem?: number;
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  category: Category;
}

export interface SharedUser {
  name: string;
  avatar: string;
  anniversary: string;
}
