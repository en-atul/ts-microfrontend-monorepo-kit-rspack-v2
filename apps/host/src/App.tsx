import { onEvent, useEcomStore } from '@repo/ecommerce-core';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

import ErrorBoundary from './ErrorBoundary';

const ProductListingWidget = React.lazy(() => import('productListingApp/ProductListingWidget'));
const ProductDetailsWidget = React.lazy(() => import('productDetailsApp/ProductDetailsWidget'));
const CartWidget = React.lazy(() => import('cartApp/CartWidget'));
const CheckoutWidget = React.lazy(() => import('checkoutApp/CheckoutWidget'));
const UserProfileWidget = React.lazy(() => import('userProfileApp/UserProfileWidget'));

const getRouteFromUrl = () => window.location.hash.replace(/^#/, '') || '/products';

const App: React.FC = () => {
	const [route, setRoute] = useState(getRouteFromUrl());
	const cartItemsCount = useEcomStore((state) =>
		state.cart.reduce((sum, item) => sum + item.quantity, 0),
	);
	const user = useEcomStore((state) => state.user);

	useEffect(() => {
		const onHashChange = () => setRoute(getRouteFromUrl());
		const offNavigate = onEvent('navigation:go', ({ route: nextRoute }) => {
			window.location.hash = nextRoute;
		});
		window.addEventListener('hashchange', onHashChange);
		return () => {
			window.removeEventListener('hashchange', onHashChange);
			offNavigate();
		};
	}, []);

	const selectedProductId = useMemo(() => {
		const parts = route.split('/');
		if (parts[1] === 'products' && parts[2]) {
			return parts[2];
		}
		return 'p-101';
	}, [route]);

	const renderMfeView = () => {
		if (route.startsWith('/products/') && selectedProductId) {
			return <ProductDetailsWidget productId={selectedProductId} />;
		}
		if (route === '/cart') return <CartWidget />;
		if (route === '/checkout') return <CheckoutWidget />;
		if (route === '/profile') return <UserProfileWidget />;
		return <ProductListingWidget />;
	};

	const isActive = (path: string) => {
		if (path === '/products') {
			return route === '/products' || route.startsWith('/products/');
		}
		return route === path;
	};

	return (
		<div className="ecom-shell">
			<header className="ecom-topbar">
				<h1 className="ecom-title">E-Commerce Host</h1>
				<div className="ecom-user">
					<span className="ecom-avatar">{(user?.name ?? 'A').slice(0, 2).toUpperCase()}</span>
					<span>{user?.name ?? 'Guest User'}</span>
				</div>
			</header>

			<nav className="ecom-tabs">
				<a className={`ecom-tab ${isActive('/products') ? 'is-active' : ''}`} href="#/products">
					<span>Shop</span>
				</a>
				<a className={`ecom-tab ${isActive('/cart') ? 'is-active' : ''}`} href="#/cart">
					<span>Cart ({cartItemsCount})</span>
				</a>
				<a className={`ecom-tab ${isActive('/checkout') ? 'is-active' : ''}`} href="#/checkout">
					<span>Checkout</span>
				</a>
				<a className={`ecom-tab ${isActive('/profile') ? 'is-active' : ''}`} href="#/profile">
					<span>Profile</span>
				</a>
			</nav>

			<p className="ecom-breadcrumb">
				Home {'>'} {route.startsWith('/products/') ? 'Product Details' : route.replace('/', '') || 'products'}
			</p>

			<ErrorBoundary message="Failed to load remote module. Check remotes are running.">
				<Suspense fallback={<div>Loading remote module...</div>}>
					{renderMfeView()}
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default App;
