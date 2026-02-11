
// Fixed: Removed non-existent 'Activity' type from the imports list
import { Memory, SharedUser } from './types';

export const OUR_ACCOUNT: SharedUser = {
  name: 'Nosotros',
  avatar: '/maria-y-guillem-passport.jpg.jpeg',
  anniversary: '2022-09-25'
};

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 10);
const futureDateStr = futureDate.toISOString().split('T')[0];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'next-spec',
    title: 'Cena Romántica de Aniversario',
    date: futureDateStr,
    location: 'Le Petit Bistro, Madrid',
    category: 'Comida',
    description: 'Nuestra cita especial para celebrar todo este tiempo juntos. ¡Tengo una sorpresa preparada!',
    imageUrls: [
      'https://images.unsplash.com/photo-1550966841-3ee7adac1af0?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: true
  },
  {
    id: '1',
    title: 'Ruta por la Costa Azul',
    date: '2024-07-15',
    endDate: '2024-07-22',
    location: 'Niza, Francia',
    category: 'Viaje',
    description: 'Nuestra primera gran ruta en coche. Conducir por las carreteras de la costa mientras escuchábamos nuestra playlist favorita fue mágico. Las vistas desde el hotel en Niza no tenían precio.',
    imageUrls: [
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: true,
    km: 1450
  },
  {
    id: '2',
    title: 'Dune: Parte Dos',
    date: '2024-08-05',
    location: 'Cines Callao, Madrid',
    category: 'Cine',
    movie: 'Dune: Parte Dos',
    description: 'Fuimos al estreno de Dune. Salimos flipando con la fotografía y la música. Cenamos un hot-dog rápido después mientras comentábamos el final. ¡Qué ganas de la tercera!',
    imageUrls: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517604401157-538a9663ecb4?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: false,
    ratingMaria: 5,
    ratingGuillem: 4
  },
  {
    id: 'cine-inside-out',
    title: 'Inside Out 2',
    date: '2024-06-20',
    location: 'Cinesa Proyecciones',
    category: 'Cine',
    movie: 'Inside Out 2',
    description: 'Lloramos un poquito con Ansiedad. Nos sentimos muy identificados. Una tarde muy dulce con palomitas dulces y saladas mezcladas como nos gusta.',
    imageUrls: [
      'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: true,
    ratingMaria: 5,
    ratingGuillem: 5
  },
  {
    id: '3',
    title: 'Cena de Sushi Especial',
    date: '2024-05-20',
    location: 'Restaurante Oishii',
    category: 'Comida',
    description: 'Tres años juntos. El sushi estaba increíble, pero lo mejor fue el postre sorpresa que prepararon con nuestra canción sonando de fondo.',
    imageUrls: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: true
  },
  {
    id: '4',
    title: '¡Nos mudamos juntos!',
    date: '2023-11-12',
    location: 'Nuestro nuevo hogar',
    category: 'Hito',
    description: 'El día que por fin dejamos de vivir en dos sitios distintos. Montar los muebles de IKEA fue el primer gran test de nuestra paciencia, ¡pero lo logramos!',
    imageUrls: [
      'https://images.unsplash.com/photo-1583847268964-b28dc2f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80'
    ],
    isFavorite: true
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Viaje': '#3b82f6',
  'Comida': '#f97316',
  'Cine': '#a855f7',
  'Hito': '#eab308',
  'Tometa': '#ef4444',
};
