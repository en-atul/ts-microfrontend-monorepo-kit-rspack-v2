import Button from '@repo/ui/Button';
import { emitEvent, products, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';

const ProductListingWidget: React.FC = () => {
	const addToCart = useEcomStore((state) => state.addToCart);
	const updateQuantity = useEcomStore((state) => state.updateQuantity);
	const cart = useEcomStore((state) => state.cart);
	const total = cart.reduce((sum, item) => {
		const product = products.find((p) => p.id === item.productId);
		return sum + (product ? product.price * item.quantity : 0);
	}, 0);

	return (
		<div className="ecom-grid">
			{products.map((product) => {
				const cartItem = cart.find((item) => item.productId === product.id);
				const quantity = cartItem?.quantity ?? 0;

				return (
					<article className="ecom-card" key={product.id}>
						<img
							className="ecom-product-img"
							src={product.image}
							alt={product.name}
							onError={(event) => {
								event.currentTarget.src = 'https://picsum.photos/seed/ecom-fallback/800/500';
							}}
						/>
						<h3>{product.name}</h3>
						<p className="ecom-product-category">{product.category}</p>
						<p className="ecom-product-price">${product.price}</p>
						<div className="ecom-row">
							<a
								className="ecom-link"
								href={`/products/${product.id}`}
								onClick={(event) => {
									event.preventDefault();
									emitEvent('navigation:go', { route: `/products/${product.id}` });
								}}
							>
								View Details
							</a>
							{quantity > 0 ? (
								<div className="ecom-qty-control ecom-cart-action">
									<button
										className="ecom-qty-btn"
										type="button"
										aria-label={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
										onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
									>
										{quantity === 1 ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												aria-hidden="true"
											>
												<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
												<path d="M3 6h18" />
												<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
											</svg>
										) : (
											'-'
										)}
									</button>
									<span className="ecom-qty-value">{quantity}</span>
									<button
										className="ecom-qty-btn"
										type="button"
										aria-label="Increase quantity"
										onClick={() => addToCart(product.id)}
									>
										+
									</button>
								</div>
							) : (
								<Button className="ecom-cart-action" onClick={() => addToCart(product.id)}>
									Add To Cart
								</Button>
							)}
						</div>
					</article>
				);
			})}
			<div className="ecom-card ecom-summary">
				<div>
					<p>Cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
					<p>Total: ${total}</p>
				</div>
				<button
					className="ecom-btn-white"
					onClick={() => emitEvent('navigation:go', { route: '/checkout' })}
					type="button"
				>
					Go to Checkout
				</button>
			</div>
		</div>
	);
};

export default ProductListingWidget;
