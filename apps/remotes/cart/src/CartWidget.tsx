import Button from '@repo/ui/Button';
import { emitEvent, getProductById, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './index.css';

const CartWidget: React.FC = () => {
	const cart = useEcomStore((state) => state.cart);
	const updateQuantity = useEcomStore((state) => state.updateQuantity);
	const removeFromCart = useEcomStore((state) => state.removeFromCart);

	const total = cart.reduce((sum, item) => {
		const product = getProductById(item.productId);
		return sum + (product ? product.price * item.quantity : 0);
	}, 0);

	return (
		<section className="mx-auto max-w-3xl">
			<h2 className="mb-8 text-2xl font-bold italic uppercase tracking-tighter text-white">
				Your Bag
			</h2>

			{cart.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-center">
					<p className="mb-4 text-sm text-slate-500">Your bag is currently empty.</p>
					<button
						type="button"
						onClick={() => emitEvent('navigation:go', { route: '/products' })}
						className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:underline"
					>
						Continue shopping
					</button>
				</div>
			) : (
				<div className="space-y-5">
					<div className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/50">
						{cart.map((item) => {
							const product = getProductById(item.productId);
							if (!product) return null;

							return (
								<div key={item.productId} className="flex items-center gap-4 p-4">
									<img
										src={product.image}
										alt={product.name}
										className="h-16 w-16 rounded-lg object-cover"
										onError={(event) => {
											event.currentTarget.src =
												'https://picsum.photos/seed/ecom-cart-fallback/200/200';
										}}
									/>

									<div className="min-w-0 flex-1">
										<h4 className="truncate text-sm font-bold text-white">{product.name}</h4>
										<p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
											{product.category}
										</p>
									</div>

									<div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 p-1">
										<button
											type="button"
											onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
											className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800"
											aria-label="Decrease quantity"
										>
											<Minus className="h-3 w-3" />
										</button>
										<span className="w-6 text-center text-xs font-bold text-white">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() => updateQuantity(item.productId, item.quantity + 1)}
											className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800"
											aria-label="Increase quantity"
										>
											<Plus className="h-3 w-3" />
										</button>
									</div>

									<div className="min-w-[92px] text-right">
										<p className="text-sm font-bold text-white">${product.price * item.quantity}</p>
										<button
											type="button"
											onClick={() => removeFromCart(item.productId)}
											className="text-[10px] font-bold uppercase tracking-widest text-red-500/70 transition-colors hover:text-red-500"
										>
											Remove
										</button>
									</div>
								</div>
							);
						})}
					</div>

					<div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center">
						<div>
							<span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
								Total amount
							</span>
							<span className="text-2xl font-bold text-white">${total}</span>
						</div>

						<button
							type="button"
							onClick={() => emitEvent('navigation:go', { route: '/checkout' })}
							className="w-full rounded-xl bg-indigo-600 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 shadow-lg active:scale-95 md:w-auto"
						>
							Checkout
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default CartWidget;
