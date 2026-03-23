import React from 'react';
import ProductDetailsWidget from './ProductDetailsWidget';

const App: React.FC = () => {
	return (
		<div style={{ padding: 20 }}>
			<h1>Product Details Remote</h1>
			<ProductDetailsWidget productId="p-101" />
		</div>
	);
};

export default App;
