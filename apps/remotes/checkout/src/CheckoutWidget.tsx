import Button from '@repo/ui/Button';
import { emitEvent, useEcomStore } from '@repo/ecommerce-core';
import React, { useState } from 'react';

const CheckoutWidget: React.FC = () => {
	const cart = useEcomStore((state) => state.cart);
	const clearCart = useEcomStore((state) => state.clearCart);
	const user = useEcomStore((state) => state.user);
	const [address, setAddress] = useState('');

	const canPlaceOrder = cart.length > 0 && address.trim().length > 3 && !!user;

	const placeOrder = () => {
		const orderId = `ORD-${Date.now()}`;
		clearCart();
		emitEvent('checkout:completed', { orderId });
		emitEvent('navigation:go', { route: '/products' });
		alert(`Order placed: ${orderId}`);
	};

	return (
		<section style={{ border: '1px solid #333', borderRadius: 12, padding: 16 }}>
			{!user && <p>Please login from User Profile before checkout.</p>}
			<div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
				<label htmlFor="address">Shipping Address</label>
				<input
					id="address"
					value={address}
					onChange={(event) => setAddress(event.target.value)}
					placeholder="221B Baker Street, London"
				/>
				<Button disabled={!canPlaceOrder} onClick={placeOrder}>
					Place Order
				</Button>
			</div>
		</section>
	);
};

export default CheckoutWidget;
