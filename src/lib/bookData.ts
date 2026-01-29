export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  price: number;
  coverImage?: string; // Will be PDF cover or uploaded image
  description: string;
  pageCount?: number;
}

// Placeholder books - will be replaced with actual PDFs
export const BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Teachings of Prophet Gad',
    subtitle: 'Volume I',
    author: 'Prophet Gad',
    price: 15,
    description: 'Foundational teachings and wisdom for the remnant seed.',
    pageCount: 120,
  },
  {
    id: 'book-2',
    title: 'Laws of the Most High',
    author: 'Prophet Gad',
    price: 15,
    description: 'Understanding the commandments and statutes.',
    pageCount: 95,
  },
  {
    id: 'book-3',
    title: 'Heritage of Israel',
    author: 'Prophet Gad',
    price: 15,
    description: 'Tracing the lineage and history of the chosen people.',
    pageCount: 150,
  },
  {
    id: 'book-4',
    title: 'Feast Days Explained',
    author: 'Prophet Gad',
    price: 15,
    description: 'A guide to keeping the holy days.',
    pageCount: 80,
  },
  {
    id: 'book-5',
    title: 'Raising Righteous Children',
    author: 'Prophet Gad',
    price: 15,
    description: 'Wisdom for parents raising the next generation.',
    pageCount: 110,
  },
];
