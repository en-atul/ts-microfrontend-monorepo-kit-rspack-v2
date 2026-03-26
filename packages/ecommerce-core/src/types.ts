export type Product = {
	id: string;
	name: string;
	price: number;
	category: string;
	rating: number;
	description: string;
	image: string;
};

export type CartItem = {
	productId: string;
	quantity: number;
};

export type User = {
	name: string;
	email: string;
};

export type EcomEventMap = {
	'cart:item-added': { productId: string; quantity: number };
	'cart:updated': { itemCount: number };
	'checkout:completed': { orderId: string };
	'auth:login': { email: string };
	'auth:logout': {};
	'navigation:go': { route: string };
};
