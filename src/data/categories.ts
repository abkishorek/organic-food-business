import type { Category } from '../types';

/** To rename or reorder categories, edit here. Product category ids must match. */
export const categories: Category[] = [
  {
    id: 'spices',
    name: 'Spices & Masalas',
    blurb: 'Pepper, turmeric, rasam and sambar powders, and a traditional mango pickle.',
  },
  { id: 'oils', name: 'Oils', blurb: 'Groundnut and coconut oil for the kitchen.' },
  { id: 'beverages', name: 'Tea & Coffee', blurb: 'Tea powder and coffee powder.' },
  { id: 'honey-nuts', name: 'Honey & Nuts', blurb: 'Honey and cashew.' },
];
