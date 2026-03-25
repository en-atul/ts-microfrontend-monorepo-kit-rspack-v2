import React from 'react';
import { createRoot } from 'react-dom/client';
import '@repo/styles/global.css';

import App from './App';
import './index.css';

type MfRemoteResolution = Record<string, { url: string; source: string; resolvedAt?: number }>;

const ensureMfFallbackBanner = () => {
	if (typeof window === 'undefined') {
		return;
	}
	if (import.meta.env?.MODE && import.meta.env.MODE !== 'development') {
		return;
	}
	if (document.getElementById('mf-remote-fallback-banner')) {
		return;
	}

	const banner = document.createElement('div');
	banner.id = 'mf-remote-fallback-banner';
	banner.style.position = 'fixed';
	banner.style.left = '12px';
	banner.style.right = '12px';
	banner.style.bottom = '12px';
	banner.style.zIndex = '99999';
	banner.style.padding = '10px 12px';
	banner.style.borderRadius = '10px';
	banner.style.background = 'rgba(20, 20, 20, 0.92)';
	banner.style.color = '#fff';
	banner.style.fontSize = '12px';
	banner.style.lineHeight = '1.35';
	banner.style.fontFamily =
		'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';
	banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
	banner.style.display = 'none';

	const text = document.createElement('div');
	text.textContent = 'Some microfrontends are running from a fallback (not localhost).';
	text.style.marginBottom = '6px';

	const details = document.createElement('div');
	details.style.opacity = '0.9';
	details.style.wordBreak = 'break-word';

	const close = document.createElement('button');
	close.type = 'button';
	close.textContent = 'Dismiss';
	close.style.marginTop = '8px';
	close.style.padding = '6px 10px';
	close.style.borderRadius = '8px';
	close.style.border = '1px solid rgba(255,255,255,0.25)';
	close.style.background = 'transparent';
	close.style.color = 'inherit';
	close.style.cursor = 'pointer';
	close.onclick = () => banner.remove();

	banner.appendChild(text);
	banner.appendChild(details);
	banner.appendChild(close);
	document.body.appendChild(banner);

	const renderDetails = () => {
		const map = (window as Window & { __MF_REMOTE_RESOLUTION__?: MfRemoteResolution })
			.__MF_REMOTE_RESOLUTION__;
		if (!map) {
			return;
		}

		const fallbacks = Object.entries(map).filter(([, v]) => v?.source && v.source !== 'local');
		if (fallbacks.length === 0) {
			return;
		}

		details.textContent = fallbacks
			.map(([scope, v]) => `${scope} → ${v.source} (${v.url})`)
			.join(' · ');
		banner.style.display = 'block';
	};

	window.addEventListener('mf:remote-resolved', renderDetails);
	// In case remotes resolved before listener attached.
	setTimeout(renderDetails, 0);
};

// Mounting React app using React 18+
const container = document.getElementById('root');

if (!container) {
	throw new Error(
		'Root container not found. Make sure there is a div with id="root" in your index.html',
	);
}

ensureMfFallbackBanner();

const root = createRoot(container);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
