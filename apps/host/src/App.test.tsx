/// <reference types="jest" />

import { emitEvent, useEcomStore } from '@repo/ecommerce-core';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import App from './App';

jest.mock(
	'productListingApp/ProductListingWidget',
	() => ({
		__esModule: true,
		default: () => <div>Product Listing Remote</div>,
	}),
	{ virtual: true },
);

jest.mock(
	'productDetailsApp/ProductDetailsWidget',
	() => ({
		__esModule: true,
		default: ({ productId }: { productId: string }) => (
			<div>Product Details Remote: {productId}</div>
		),
	}),
	{ virtual: true },
);

jest.mock(
	'cartApp/CartWidget',
	() => ({
		__esModule: true,
		default: () => <div>Cart Remote</div>,
	}),
	{ virtual: true },
);

jest.mock(
	'checkoutApp/CheckoutWidget',
	() => ({
		__esModule: true,
		default: () => <div>Checkout Remote</div>,
	}),
	{ virtual: true },
);

jest.mock(
	'userProfileApp/UserProfileWidget',
	() => ({
		__esModule: true,
		default: () => <div>User Profile Remote</div>,
	}),
	{ virtual: true },
);

describe('Host app integration', () => {
	beforeEach(() => {
		window.history.pushState({}, '', '/');
		localStorage.clear();
		useEcomStore.setState({ cart: [], user: null });
	});

	it('redirects root path to products and renders listing remote', async () => {
		render(<App />);

		expect(await screen.findByText('Product Listing Remote')).toBeInTheDocument();
		expect(screen.getByText('Home > products')).toBeInTheDocument();
	});

	it('shows cart count from shared store in navigation', async () => {
		useEcomStore.setState({
			cart: [
				{ productId: 'p-101', quantity: 1 },
				{ productId: 'p-102', quantity: 2 },
			],
			user: { id: 'u-1', name: 'Atul', email: 'atul@example.com' },
		});

		render(<App />);

		expect(await screen.findByText('Product Listing Remote')).toBeInTheDocument();
		expect(screen.getByText('Cart (3)')).toBeInTheDocument();
		expect(screen.getByText('AT')).toBeInTheDocument();
	});

	it('navigates when navigation event is emitted', async () => {
		render(<App />);
		expect(await screen.findByText('Product Listing Remote')).toBeInTheDocument();

		act(() => {
			emitEvent('navigation:go', { route: '/checkout' });
		});

		await waitFor(() => {
			expect(screen.getByText('Checkout Remote')).toBeInTheDocument();
		});
	});
});
