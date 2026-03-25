import React from 'react';
import { createRoot } from 'react-dom/client';
import '@repo/styles/global.css';

import App from './App';
import { MfEnvironmentStatusPanel } from './components/mf-environment-status';
import './index.css';

const container = document.getElementById('root');

if (!container) {
	throw new Error(
		'Root container not found. Make sure there is a div with id="root" in your index.html',
	);
}

const root = createRoot(container);
root.render(
	<React.StrictMode>
		<MfEnvironmentStatusPanel />
		<App />
	</React.StrictMode>,
);
