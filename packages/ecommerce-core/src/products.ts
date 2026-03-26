import type { Product } from './types';

export const products: Product[] = [
	{
		id: 'p-101',
		name: 'Noise Cancelling Headphones',
		price: 249,
		category: 'Audio',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
		description: 'Premium sound quality with industry-leading noise cancellation.',
	},
	{
		id: 'p-102',
		name: 'Smart Fitness Watch',
		price: 179,
		category: 'Wearables',
		rating: 4.6,
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
		description: 'Track your fitness goals with precision and style.',
	},
	{
		id: 'p-103',
		name: 'Ergonomic Office Chair',
		price: 329,
		category: 'Furniture',
		rating: 4.9,
		image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
		description: 'Work in comfort with adjustable lumbar support.',
	},
	{
		id: 'p-104',
		name: 'Mechanical Keyboard',
		price: 129,
		category: 'Accessories',
		rating: 4.7,
		image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
		description: 'Tactile feedback and RGB backlighting for pros.',
	},
];

export const getProductById = (id: string) => products.find((product) => product.id === id);
