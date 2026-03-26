import Button from '@repo/ui/Button';
import { emitEvent, useEcomStore } from '@repo/ecommerce-core';
import React, { useState } from 'react';
import { CreditCard, MapPin } from 'lucide-react';
import './index.css';

const CheckoutWidget: React.FC = () => {
	const cart = useEcomStore((state) => state.cart);
	const clearCart = useEcomStore((state) => state.clearCart);
	const user = useEcomStore((state) => state.user);
	const [address, setAddress] = useState('');

	const canPlaceOrder = cart.length > 0 && address.trim().length > 3 && !!user;
	const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

	const placeOrder = () => {
		const orderId = `ORD-${Date.now()}`;
		clearCart();
		emitEvent('checkout:completed', { orderId });
		emitEvent('navigation:go', { route: '/products' });
		alert(`Order placed: ${orderId}`);
	};

	return (
		<section className="mx-auto max-w-4xl">
			<h2 className="mb-8 text-2xl font-bold italic uppercase tracking-tighter text-white">
				Checkout
			</h2>

			{!user && (
				<div className="mb-6 rounded-2xl border border-slate-900 bg-slate-900/50 p-4 text-sm text-slate-500">
					Please login from User Profile before checkout.
				</div>
			)}

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
						<div className="mb-4 flex items-center gap-2">
							<MapPin className="h-4 w-4 text-indigo-400" />
							<h3 className="text-xs font-bold uppercase tracking-wider text-white">Shipping</h3>
						</div>
						<label htmlFor="address" className="sr-only">
							Shipping address
						</label>
						<textarea
							id="address"
							className="min-h-[100px] w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300 outline-none transition-colors focus:border-indigo-500"
							value={address}
							onChange={(event) => setAddress(event.target.value)}
							placeholder="221B Baker Street, London"
						/>
					</div>

					<div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
						<div className="mb-4 flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-indigo-400" />
							<h3 className="text-xs font-bold uppercase tracking-wider text-white">Payment</h3>
						</div>
						<div className="flex items-center justify-between rounded-xl border border-slate-800 p-3">
							<span className="text-sm text-slate-300">•••• 4242</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
								Selected
							</span>
						</div>
					</div>
				</div>

				<div className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
					<h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Summary</h3>
					<div className="mb-6 space-y-3 text-sm">
						<div className="flex justify-between text-slate-500">
							<span>Subtotal</span>
							<span className="font-bold text-white">${cartTotal}</span>
						</div>
						<div className="flex justify-between text-slate-500">
							<span>Shipping</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
								Free
							</span>
						</div>
						<div className="flex justify-between border-t border-slate-800 pt-3 font-bold text-white">
							<span className="text-xs uppercase tracking-widest">Total</span>
							<span className="text-lg">${cartTotal}</span>
						</div>
					</div>

					<button
						type="button"
						disabled={!canPlaceOrder}
						onClick={placeOrder}
						className="w-full rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 shadow-lg transition-all hover:bg-indigo-500 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-slate-950"
					>
						Complete Order
					</button>
				</div>
			</div>
		</section>
	);
};

export default CheckoutWidget;
