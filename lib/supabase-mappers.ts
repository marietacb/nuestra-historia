import type { Memory, BucketItem } from '../types';

export type MemoryRow = {
  id: string;
  title: string;
  date: string;
  end_date: string | null;
  location: string;
  description: string;
  image_urls: string[];
  category: string;
  is_favorite: boolean;
  km: number | null;
  movie: string | null;
  rating_maria: number | null;
  rating_guillem: number | null;
};

export function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    endDate: row.end_date ?? undefined,
    location: row.location,
    description: row.description,
    imageUrls: Array.isArray(row.image_urls) ? row.image_urls : [],
    category: row.category as Memory['category'],
    isFavorite: row.is_favorite,
    km: row.km ?? undefined,
    movie: row.movie ?? undefined,
    ratingMaria: row.rating_maria ?? undefined,
    ratingGuillem: row.rating_guillem ?? undefined,
  };
}

export function memoryToRow(m: Memory): MemoryRow {
  return {
    id: m.id,
    title: m.title,
    date: m.date,
    end_date: m.endDate ?? null,
    location: m.location,
    description: m.description,
    image_urls: m.imageUrls ?? [],
    category: m.category,
    is_favorite: !!m.isFavorite,
    km: m.km ?? null,
    movie: m.movie ?? null,
    rating_maria: m.ratingMaria ?? null,
    rating_guillem: m.ratingGuillem ?? null,
  };
}

export type BucketRow = {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  category: string;
};

export function rowToBucket(row: BucketRow): BucketItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    isCompleted: row.is_completed,
    category: row.category as BucketItem['category'],
  };
}

export function bucketToRow(b: BucketItem): BucketRow {
  return {
    id: b.id,
    title: b.title,
    description: b.description,
    is_completed: b.isCompleted,
    category: b.category,
  };
}
