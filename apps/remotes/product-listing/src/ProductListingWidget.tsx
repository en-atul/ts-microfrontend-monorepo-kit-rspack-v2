import Button from '@repo/ui/Button';
import { emitEvent, products, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';
import { Star } from 'lucide-react';
import './index.css';

const ProductListingWidget: React.FC = () => {
	const addToCart = useEcomStore((state) => state.addToCart);
	const updateQuantity = useEcomStore((state) => state.updateQuantity);
	const cart = useEcomStore((state) => state.cart);
	const total = cart.reduce((sum, item) => {
		const product = products.find((p) => p.id === item.productId);
		return sum + (product ? product.price * item.quantity : 0);
	}, 0);

	return (
		<div>
			<div className="mb-10">
				<h1 className="mb-2 text-3xl font-bold italic uppercase tracking-tight text-white">
					Products
				</h1>
				<p className="text-sm font-medium text-slate-500">Browse our latest developer hardware.</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{products.map((product) => {
					const cartItem = cart.find((item) => item.productId === product.id);
					const quantity = cartItem?.quantity ?? 0;

					return (
						<div
							key={product.id}
							className="group flex flex-col overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/50 transition-colors hover:border-slate-700"
						>
							<div className="aspect-square overflow-hidden bg-slate-900">
								<img
									src={product.image}
									alt={product.name}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									onError={(event) => {
										event.currentTarget.src = 'https://picsum.photos/seed/ecom-fallback/800/500';
									}}
								/>
							</div>

							<div className="flex flex-1 flex-col p-5">
								<div className="mb-1 flex items-start justify-between gap-3">
									<span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
										{product.category}
									</span>
									<div className="flex items-center gap-1">
										<Star className="h-3 w-3 fill-current text-yellow-500" />
										<span className="text-xs font-medium text-slate-400">{product.rating}</span>
									</div>
								</div>

								<h3 className="mb-2 text-base font-semibold text-white">{product.name}</h3>
								<p className="mb-4 line-clamp-2 flex-1 text-xs text-slate-500">
									{product.description}
								</p>

								<div className="mt-auto flex items-center justify-between gap-3">
									<span className="text-lg font-bold text-white">${product.price}</span>

									{quantity > 0 ? (
										<div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 p-1">
											<button
												type="button"
												aria-label={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
												onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
												className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800"
											>
												{quantity === 1 ? '×' : '−'}
											</button>
											<span className="w-6 text-center text-xs font-bold text-white">
												{quantity}
											</span>
											<button
												type="button"
												aria-label="Increase quantity"
												onClick={() => addToCart(product.id)}
												className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800"
											>
												+
											</button>
										</div>
									) : (
										<button
											type="button"
											onClick={() => addToCart(product.id)}
											className="rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-indigo-500"
										>
											Add to Cart
										</button>
									)}
								</div>

								<button
									type="button"
									onClick={() => emitEvent('navigation:go', { route: `/products/${product.id}` })}
									className="mt-4 text-left text-xs font-black uppercase tracking-widest text-indigo-400 hover:underline"
								>
									View Details
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div>
						<span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
							Total Amount
						</span>
						<span className="text-2xl font-bold text-white">${total}</span>
					</div>

					<button
						type="button"
						onClick={() => emitEvent('navigation:go', { route: '/checkout' })}
						className="w-full rounded-xl bg-indigo-600 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 active:scale-95 md:w-auto"
					>
						Checkout
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductListingWidget;
