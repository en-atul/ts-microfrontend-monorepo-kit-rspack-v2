import Button from '@repo/ui/Button';
import { emitEvent, getProductById, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';

const CartWidget: React.FC = () => {
	const cart = useEcomStore((state) => state.cart);
	const updateQuantity = useEcomStore((state) => state.updateQuantity);
	const removeFromCart = useEcomStore((state) => state.removeFromCart);

	const total = cart.reduce((sum, item) => {
		const product = getProductById(item.productId);
		return sum + (product ? product.price * item.quantity : 0);
	}, 0);

	return (
		<section style={{ border: '1px solid #333', borderRadius: 12, padding: 16 }}>
			{cart.length === 0 && <p>Your cart is empty.</p>}
			{cart.map((item) => {
				const product = getProductById(item.productId);
				if (!product) return null;
				return (
					<div key={item.productId} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
						<span style={{ minWidth: 180 }}>{product.name}</span>
						<input
							type="number"
							min={1}
							value={item.quantity}
							onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
						/>
						<Button onClick={() => removeFromCart(item.productId)} outline>
							Remove
						</Button>
					</div>
				);
			})}
			<h3>Total: ${total}</h3>
			<Button onClick={() => emitEvent('navigation:go', { route: '/checkout' })}>Proceed To Checkout</Button>
		</section>
	);
};

export default CartWidget;
