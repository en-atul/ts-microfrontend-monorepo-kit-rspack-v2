declare module 'productListingApp/ProductListingWidget' {
	import type React from 'react';
	const Component: React.ComponentType;
	export default Component;
}

declare module 'productDetailsApp/ProductDetailsWidget' {
	import type React from 'react';
	const Component: React.ComponentType<{ productId?: string }>;
	export default Component;
}

declare module 'cartApp/CartWidget' {
	import type React from 'react';
	const Component: React.ComponentType;
	export default Component;
}

declare module 'checkoutApp/CheckoutWidget' {
	import type React from 'react';
	const Component: React.ComponentType;
	export default Component;
}

declare module 'userProfileApp/UserProfileWidget' {
	import type React from 'react';
	const Component: React.ComponentType;
	export default Component;
}
