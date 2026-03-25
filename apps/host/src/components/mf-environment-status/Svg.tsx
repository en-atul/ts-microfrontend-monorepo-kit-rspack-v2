import type { FC, SVGProps } from 'react';

const lucideSvgDefaults = {
	xmlns: 'http://www.w3.org/2000/svg',
	width: '24',
	height: '24',
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: '2',
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
} satisfies SVGProps<SVGSVGElement>;

export const ChevronDown: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-chevron-down-icon lucide-chevron-down"
		aria-hidden
	>
		<path d="m6 9 6 6 6-6" />
	</svg>
);

export const ChevronUp: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-chevron-up-icon lucide-chevron-up"
		aria-hidden
	>
		<path d="m18 15-6-6-6 6" />
	</svg>
);

export const AlertCircle: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-circle-alert-icon lucide-circle-alert"
		aria-hidden
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" x2="12" y1="8" y2="12" />
		<line x1="12" x2="12.01" y1="16" y2="16" />
	</svg>
);

export const CheckCircle: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-circle-check-icon lucide-circle-check"
		aria-hidden
	>
		<circle cx="12" cy="12" r="10" />
		<path d="m9 12 2 2 4-4" />
	</svg>
);

export const CheckCircle2: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-circle-check-big lucide-check-circle-2"
		aria-hidden
	>
		<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
		<path d="m9 12 2 2 4-4" />
	</svg>
);

export const Globe: FC = () => (
	<svg {...lucideSvgDefaults} className="lucide lucide-globe-icon lucide-globe" aria-hidden>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
		<path d="M2 12h20" />
	</svg>
);

export const Terminal: FC = () => (
	<svg {...lucideSvgDefaults} className="lucide lucide-terminal-icon lucide-terminal" aria-hidden>
		<path d="M12 19h8" />
		<path d="m4 17 6-6-6-6" />
	</svg>
);

export const ExternalLink: FC = () => (
	<svg
		{...lucideSvgDefaults}
		className="lucide lucide-external-link-icon lucide-external-link"
		aria-hidden
	>
		<path d="M15 3h6v6" />
		<path d="M10 14 21 3" />
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
	</svg>
);

export const Copy: FC = () => (
	<svg {...lucideSvgDefaults} className="lucide lucide-copy-icon lucide-copy" aria-hidden>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</svg>
);

export const Info: FC = () => (
	<svg {...lucideSvgDefaults} className="lucide lucide-info-icon lucide-info" aria-hidden>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	</svg>
);
