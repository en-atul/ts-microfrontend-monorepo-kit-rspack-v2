import { onEvent, useEcomStore } from '@repo/ecommerce-core';
import React, { Suspense, useEffect } from 'react';
import {
	BrowserRouter,
	Navigate,
	NavLink,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

const ProductListingWidget = React.lazy(() => import('productListingApp/ProductListingWidget'));
const ProductDetailsWidget = React.lazy(() => import('productDetailsApp/ProductDetailsWidget'));
const CartWidget = React.lazy(() => import('cartApp/CartWidget'));
const CheckoutWidget = React.lazy(() => import('checkoutApp/CheckoutWidget'));
const UserProfileWidget = React.lazy(() => import('userProfileApp/UserProfileWidget'));

const RemoteBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ErrorBoundary message="Failed to load remote module. Check remotes are running.">
		<Suspense fallback={<div>Loading remote module...</div>}>{children}</Suspense>
	</ErrorBoundary>
);

const ProductDetailsRoute: React.FC = () => {
	const { productId } = useParams();
	return <ProductDetailsWidget productId={productId || 'p-101'} />;
};

const NavigationEventsBridge: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		return onEvent('navigation:go', ({ route }) => {
			navigate(route);
		});
	}, [navigate]);

	return null;
};

const ShellLayout: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const cartItemsCount = useEcomStore((state) =>
		state.cart.reduce((sum, item) => sum + item.quantity, 0),
	);
	const user = useEcomStore((state) => state.user);

	const isProducts = location.pathname === '/products' || location.pathname.startsWith('/products/');

	return (
		<div className="ecom-shell">
			<header className="ecom-topbar">
				<h1 className="ecom-title">E-Commerce Host</h1>
				<div className="ecom-user">
					<span>{user?.name ?? 'Guest User'}</span>
					<span className="ecom-avatar">{(user?.name ?? 'A').slice(0, 2).toUpperCase()}</span>
					<button className="ecom-header-cart" type="button" onClick={() => navigate('/cart')}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<circle cx="8" cy="21" r="1" />
							<circle cx="19" cy="21" r="1" />
							<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
						</svg>
						{cartItemsCount > 0 && <span className="ecom-header-cart-badge">{cartItemsCount}</span>}
					</button>
				</div>
			</header>

			<nav className="ecom-tabs">
				<NavLink className={`ecom-tab ${isProducts ? 'is-active' : ''}`} to="/products">
					<span>Shop</span>
				</NavLink>
				<NavLink className={({ isActive }) => `ecom-tab ${isActive ? 'is-active' : ''}`} to="/cart">
					<span>Cart ({cartItemsCount})</span>
				</NavLink>
				<NavLink className={({ isActive }) => `ecom-tab ${isActive ? 'is-active' : ''}`} to="/checkout">
					<span>Checkout</span>
				</NavLink>
				<NavLink className={({ isActive }) => `ecom-tab ${isActive ? 'is-active' : ''}`} to="/profile">
					<span>Profile</span>
				</NavLink>
			</nav>

			<p className="ecom-breadcrumb">
				Home {'>'}{' '}
				{location.pathname.startsWith('/products/')
					? 'Product Details'
					: location.pathname.replace('/', '') || 'products'}
			</p>

			<Routes>
				<Route
					path="/products"
					element={
						<RemoteBoundary>
							<ProductListingWidget />
						</RemoteBoundary>
					}
				/>
				<Route
					path="/products/:productId"
					element={
						<RemoteBoundary>
							<ProductDetailsRoute />
						</RemoteBoundary>
					}
				/>
				<Route
					path="/cart"
					element={
						<RemoteBoundary>
							<CartWidget />
						</RemoteBoundary>
					}
				/>
				<Route
					path="/checkout"
					element={
						<RemoteBoundary>
							<CheckoutWidget />
						</RemoteBoundary>
					}
				/>
				<Route
					path="/profile"
					element={
						<RemoteBoundary>
							<UserProfileWidget />
						</RemoteBoundary>
					}
				/>
				<Route path="/" element={<Navigate to="/products" replace />} />
				<Route path="*" element={<Navigate to="/products" replace />} />
			</Routes>
		</div>
	);
};

const App: React.FC = () => (
	<BrowserRouter>
		<NavigationEventsBridge />
		<ShellLayout />
	</BrowserRouter>
);

export default App;
