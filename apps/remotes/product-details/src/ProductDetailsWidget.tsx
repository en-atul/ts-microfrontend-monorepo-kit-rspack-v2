import Button from '@repo/ui/Button';
import { emitEvent, getProductById, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';
import { Star } from 'lucide-react';
import './index.css';

const RATINGS: Record<string, number> = {
	'p-101': 4.8,
	'p-102': 4.6,
	'p-103': 4.9,
	'p-104': 4.7,
};

type Props = {
	productId?: string;
};

const ProductDetailsWidget: React.FC<Props> = ({ productId = 'p-101' }) => {
	const addToCart = useEcomStore((state) => state.addToCart);
	const product = getProductById(productId);

	if (!product) {
		return (
			<div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
				<p className="text-sm text-slate-500">Product not found.</p>
				<button
					type="button"
					onClick={() => emitEvent('navigation:go', { route: '/products' })}
					className="mt-4 text-xs font-black uppercase tracking-widest text-indigo-400 hover:underline"
				>
					Back to products
				</button>
			</div>
		);
	}

	const rating = RATINGS[product.id] ?? 4.7;

	return (
		<section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/50">
				<div className="aspect-square bg-slate-900">
					<img
						src={product.image}
						alt={product.name}
						className="h-full w-full object-cover"
						onError={(event) => {
							event.currentTarget.src =
								'https://picsum.photos/seed/ecom-fallback-details/1000/1000';
						}}
					/>
				</div>
			</div>

			<div className="flex flex-col">
				<div className="mb-6">
					<div className="flex items-start justify-between gap-4">
						<span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
							{product.category}
						</span>
						<div className="flex items-center gap-1">
							<Star className="h-3 w-3 fill-current text-yellow-500" />
							<span className="text-xs font-medium text-slate-400">{rating}</span>
						</div>
					</div>
					<h2 className="mt-2 text-3xl font-bold text-white">{product.name}</h2>
					<p className="mt-3 text-sm leading-6 text-slate-500">{product.description}</p>
				</div>

				<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
					<div className="flex items-baseline justify-between gap-4">
						<div>
							<span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
								Price
							</span>
							<span className="text-2xl font-bold text-white">${product.price}</span>
						</div>

						<button
							type="button"
							onClick={() => emitEvent('navigation:go', { route: '/products' })}
							className="text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-white"
						>
							Back
						</button>
					</div>

					<div className="mt-6 flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={() => addToCart(product.id)}
							className="w-full rounded-xl bg-indigo-600 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 shadow-lg active:scale-95 sm:w-auto"
						>
							Add to Cart
						</button>
						<button
							type="button"
							onClick={() => emitEvent('navigation:go', { route: '/cart' })}
							className="w-full rounded-xl border border-slate-800 bg-slate-950 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:border-indigo-500 active:scale-95 sm:w-auto"
						>
							Go to Cart
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductDetailsWidget;
