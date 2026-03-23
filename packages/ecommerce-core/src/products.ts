import type { Product } from './types';

export const products: Product[] = [
	{
		id: 'p-101',
		name: 'Noise Cancelling Headphones',
		price: 249,
		category: 'Audio',
		description: 'Wireless headphones with adaptive noise cancellation and 30-hour battery life.',
		image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
	},
	{
		id: 'p-102',
		name: 'Smart Fitness Watch',
		price: 179,
		category: 'Wearables',
		description: 'Track workouts, heart rate, sleep and notifications with a bright AMOLED display.',
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
	},
	{
		id: 'p-103',
		name: 'Ergonomic Office Chair',
		price: 329,
		category: 'Furniture',
		description: 'Breathable mesh chair with lumbar support and multi-angle tilt adjustments.',
		image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
	},
	{
		id: 'p-104',
		name: 'Mechanical Keyboard',
		price: 129,
		category: 'Accessories',
		description: 'Compact mechanical keyboard with hot-swappable switches and RGB backlighting.',
		image: 'https://m.media-amazon.com/images/I/61P7MvyRbUL.jpg',
	},
];

export const getProductById = (id: string) => products.find((product) => product.id === id);
