import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { emitEvent } from './eventBus';
import type { CartItem, User } from './types';

type EcomState = {
	cart: CartItem[];
	user: User | null;
	addToCart: (productId: string, quantity?: number) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
	login: (user: User) => void;
	logout: () => void;
};

export const useEcomStore = create<EcomState>()(
	persist(
		(set, get) => ({
			cart: [],
			user: null,
			addToCart: (productId, quantity = 1) => {
				set((state) => {
					const existing = state.cart.find((item) => item.productId === productId);
					if (existing) {
						return {
							cart: state.cart.map((item) =>
								item.productId === productId
									? { ...item, quantity: item.quantity + quantity }
									: item,
							),
						};
					}
					return { cart: [...state.cart, { productId, quantity }] };
				});
				const itemCount = get().cart.reduce((sum, item) => sum + item.quantity, 0);
				emitEvent('cart:item-added', { productId, quantity });
				emitEvent('cart:updated', { itemCount });
			},
			updateQuantity: (productId, quantity) => {
				set((state) => ({
					cart: state.cart
						.map((item) => (item.productId === productId ? { ...item, quantity } : item))
						.filter((item) => item.quantity > 0),
				}));
				const itemCount = get().cart.reduce((sum, item) => sum + item.quantity, 0);
				emitEvent('cart:updated', { itemCount });
			},
			removeFromCart: (productId) => {
				set((state) => ({
					cart: state.cart.filter((item) => item.productId !== productId),
				}));
				const itemCount = get().cart.reduce((sum, item) => sum + item.quantity, 0);
				emitEvent('cart:updated', { itemCount });
			},
			clearCart: () => {
				set({ cart: [] });
				emitEvent('cart:updated', { itemCount: 0 });
			},
			login: (user) => {
				set({ user });
				emitEvent('auth:login', { email: user.email });
			},
			logout: () => {
				set({ user: null });
				emitEvent('auth:logout', {});
			},
		}),
		{
			name: 'ecom-mfe-store',
			partialize: (state) => ({ cart: state.cart, user: state.user }),
		},
	),
);
