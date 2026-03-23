import React from 'react';
import ProductListingWidget from './ProductListingWidget';

const App: React.FC = () => {
	return (
		<div style={{ padding: 20 }}>
			<h1>Product Listing Remote</h1>
			<ProductListingWidget />
		</div>
	);
};

export default App;
