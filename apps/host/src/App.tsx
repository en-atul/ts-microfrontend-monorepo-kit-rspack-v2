import { onEvent, useEcomStore } from '@repo/ecommerce-core';
import React, { Suspense, useEffect } from 'react';
import { Package, ShoppingCart } from 'lucide-react';
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

	return (
		<div className="min-h-screen bg-slate-950 text-slate-200">
			<nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
					<button
						type="button"
						onClick={() => navigate('/products')}
						className="flex cursor-pointer items-center gap-2"
					>
						<div className="rounded-lg bg-indigo-600 p-1.5">
							<Package className="h-5 w-5 text-white" />
						</div>
						<span className="text-lg font-bold tracking-tight uppercase tracking-widest text-white">
							E-Host
						</span>
					</button>

					<div className="flex gap-6">
						<NavLink
							to="/products"
							className={({ isActive }) =>
								`text-xs font-bold uppercase tracking-widest transition-colors ${
									isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
								}`
							}
						>
							Shop
						</NavLink>
						<NavLink
							to="/cart"
							className={({ isActive }) =>
								`text-xs font-bold uppercase tracking-widest transition-colors ${
									isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
								}`
							}
						>
							Cart
						</NavLink>
						<NavLink
							to="/checkout"
							className={({ isActive }) =>
								`text-xs font-bold uppercase tracking-widest transition-colors ${
									isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
								}`
							}
						>
							Checkout
						</NavLink>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => navigate('/cart')}
							className="relative p-2 text-slate-400 transition-colors hover:text-white"
							aria-label="Open cart"
						>
							<ShoppingCart className="h-5 w-5" />
							{cartItemsCount > 0 && (
								<span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
									{cartItemsCount}
								</span>
							)}
						</button>
						<button
							type="button"
							onClick={() => navigate('/profile')}
							className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-[10px] font-bold text-slate-300 transition-colors hover:border-indigo-400"
							aria-label="Open profile"
						>
							{(user?.name ?? 'AD').slice(0, 2).toUpperCase()}
						</button>
					</div>
				</div>
			</nav>

			<main className="mx-auto w-full max-w-6xl px-6 py-12">
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
			</main>

			<footer className="border-t border-slate-900 py-10 text-center opacity-30">
				<p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
					E-Commerce Host • Community Project
				</p>
			</footer>
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
