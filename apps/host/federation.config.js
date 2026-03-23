const hostConfig = {
    development: {
        publicPath: 'http://localhost:3000',
        remotes: {
            productListingApp: 'http://localhost:3001/remoteEntry.js',
            productDetailsApp: 'http://localhost:3002/remoteEntry.js',
            cartApp: 'http://localhost:3003/remoteEntry.js',
            checkoutApp: 'http://localhost:3004/remoteEntry.js',
            userProfileApp: 'http://localhost:3005/remoteEntry.js',
        },
        allowedOrigins: [
            'http://localhost:3001/',
            'http://localhost:3002/',
            'http://localhost:3003/',
            'http://localhost:3004/',
            'http://localhost:3005/',
        ],
    },
    production: {
        publicPath: 'http://localhost:3000',
        remotes: {
            productListingApp: 'http://localhost:3001/remoteEntry.js',
            productDetailsApp: 'http://localhost:3002/remoteEntry.js',
            cartApp: 'http://localhost:3003/remoteEntry.js',
            checkoutApp: 'http://localhost:3004/remoteEntry.js',
            userProfileApp: 'http://localhost:3005/remoteEntry.js',
        },
        allowedOrigins: [
            'http://localhost:3001/',
            'http://localhost:3002/',
            'http://localhost:3003/',
            'http://localhost:3004/',
            'http://localhost:3005/',
        ],
    },
    staging: {
        publicPath: 'http://localhost:3000',
        remotes: {
            productListingApp: 'http://localhost:3001/remoteEntry.js',
            productDetailsApp: 'http://localhost:3002/remoteEntry.js',
            cartApp: 'http://localhost:3003/remoteEntry.js',
            checkoutApp: 'http://localhost:3004/remoteEntry.js',
            userProfileApp: 'http://localhost:3005/remoteEntry.js',
        },
        allowedOrigins: [
            'http://localhost:3001/',
            'http://localhost:3002/',
            'http://localhost:3003/',
            'http://localhost:3004/',
            'http://localhost:3005/',
        ],
    },
    default: {
        publicPath: 'http://localhost:3000',
        remotes: {
            productListingApp: 'http://localhost:3001/remoteEntry.js',
            productDetailsApp: 'http://localhost:3002/remoteEntry.js',
            cartApp: 'http://localhost:3003/remoteEntry.js',
            checkoutApp: 'http://localhost:3004/remoteEntry.js',
            userProfileApp: 'http://localhost:3005/remoteEntry.js',
        },
    },
};

export default hostConfig;