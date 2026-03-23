import Button from '@repo/ui/Button';
import { emitEvent, getProductById, useEcomStore } from '@repo/ecommerce-core';
import React from 'react';

type Props = {
	productId?: string;
};

const ProductDetailsWidget: React.FC<Props> = ({ productId = 'p-101' }) => {
	const addToCart = useEcomStore((state) => state.addToCart);
	const product = getProductById(productId);

	if (!product) {
		return <div>Product not found.</div>;
	}

	return (
		<section style={{ border: '1px solid #333', borderRadius: 12, padding: 16 }}>
			<h2>{product.name}</h2>
			<p>{product.description}</p>
			<p>Category: {product.category}</p>
			<p>Price: ${product.price}</p>
			<div style={{ display: 'flex', gap: 10 }}>
				<Button onClick={() => addToCart(product.id)}>Add To Cart</Button>
				<Button onClick={() => emitEvent('navigation:go', { route: '/cart' })} outline>
					Go To Cart
				</Button>
			</div>
		</section>
	);
};

export default ProductDetailsWidget;
