import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './MfEnvironmentStatusPanel.css';

import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Copy,
	ExternalLink,
	Globe,
	Info,
	Terminal,
} from './Svg';
import type { MfRemoteEntry } from './types';
import {
	buildMfEnvTraceText,
	getClientMode,
	getResolutionEntries,
	isFallbackRow,
	panelVisibility,
	parseLocalPort,
	readMfRemoteResolution,
	shouldShowErrorTrace,
} from './utils';

const networkTip =
	'DevTools: press F12 (or Cmd+Opt+I), open the Network tab, then filter by "remoteEntry" to inspect federated loads.';

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

type MfEnvRemoteRowProps = {
	scope: string;
	entry: MfRemoteEntry;
	isOpen: boolean;
	onToggle: () => void;
};

type MfEnvRemoteSourceBadgeProps = { fallback: boolean };

const MfEnvRemoteSourceBadge: React.FC<MfEnvRemoteSourceBadgeProps> = ({ fallback }) =>
	fallback ? (
		<span className="mf-env-pill mf-env-pill--fallback">
			<span className="mf-env-pill-icon mf-env-lucide mf-env-lucide--2xs" aria-hidden="true">
				<Globe />
			</span>
			FALLBACK
		</span>
	) : (
		<span className="mf-env-pill mf-env-pill--local">
			<span className="mf-env-pill-icon mf-env-lucide mf-env-lucide--2xs" aria-hidden="true">
				<Terminal />
			</span>
			LOCAL
		</span>
	);

type MfEnvRemoteRowDetailProps = {
	entry: MfRemoteEntry;
	fallback: boolean;
	localTarget: string;
	showTrace: boolean;
};

const MfEnvRemoteErrorTrace: React.FC<{ entry: MfRemoteEntry }> = ({ entry: v }) => (
	<div className="mf-env-trace">
		<div className="mf-env-trace-title">
			<span className="mf-env-lucide mf-env-lucide--2xs" aria-hidden="true">
				<Info />
			</span>
			Error Trace
		</div>
		<div className="mf-env-trace-body">{buildMfEnvTraceText(v)}</div>
	</div>
);

const MfEnvRemoteRowDetail: React.FC<MfEnvRemoteRowDetailProps> = ({
	entry: v,
	fallback,
	localTarget,
	showTrace,
}) => {
	const fallbackActiveUrl = fallback && v.url ? v.url : '—';
	const traceText = buildMfEnvTraceText(v);
	const showTraceBlock = showTrace && traceText.length > 0;

	const copyLocal = (): void => {
		if (!isHttpUrl(localTarget)) {
			return;
		}
		void navigator.clipboard.writeText(localTarget).then(undefined, () => {
			window.prompt('Copy local URL:', localTarget);
		});
	};

	return (
		<div className="mf-env-detail">
			<div className="mf-env-detail-grid">
				<div className="mf-env-detail-stack">
					<div className="mf-env-detail-label">Local Target</div>
					<div className="mf-env-url-box">
						<span className="mf-env-url-text" title={localTarget}>
							{localTarget}
						</span>
						{isHttpUrl(localTarget) ? (
							<button
								type="button"
								className="mf-env-url-action mf-env-lucide mf-env-lucide--xs"
								aria-label="Copy local URL"
								onClick={(e) => {
									e.stopPropagation();
									copyLocal();
								}}
							>
								<Copy />
							</button>
						) : null}
					</div>
				</div>
				<div className="mf-env-detail-stack">
					<div className="mf-env-detail-label">Active Fallback</div>
					<div className={'mf-env-url-box' + (fallback ? ' mf-env-url-box--accent' : '')}>
						<span className="mf-env-url-text" title={fallbackActiveUrl}>
							{fallbackActiveUrl}
						</span>
						{fallback && isHttpUrl(fallbackActiveUrl) ? (
							<a
								className="mf-env-url-action mf-env-lucide mf-env-lucide--xs"
								href={fallbackActiveUrl}
								target="_blank"
								rel="noreferrer"
								aria-label="Open fallback URL"
								onClick={(e) => e.stopPropagation()}
							>
								<ExternalLink />
							</a>
						) : null}
					</div>
				</div>
			</div>
			{showTraceBlock ? <MfEnvRemoteErrorTrace entry={v} /> : null}
		</div>
	);
};

type MfEnvRemoteRowToggleProps = {
	scope: string;
	fallback: boolean;
	isOpen: boolean;
	port: string | null;
	onToggle: () => void;
};

const MfEnvRemoteRowToggle: React.FC<MfEnvRemoteRowToggleProps> = ({
	scope,
	fallback,
	isOpen,
	port,
	onToggle,
}) => {
	return (
		<button type="button" className="mf-env-row-main" aria-expanded={isOpen} onClick={onToggle}>
			<div className="mf-env-row-left">
				<span
					className={
						'mf-env-row-status mf-env-lucide mf-env-lucide--md' +
						(fallback ? '' : ' mf-env-row-status--ok')
					}
					aria-hidden="true"
				>
					{fallback ? <AlertCircle /> : <CheckCircle2 />}
				</span>
				<span className="mf-env-name">{scope}</span>
				<MfEnvRemoteSourceBadge fallback={fallback} />
			</div>
			<div className="mf-env-row-right">
				{fallback && port ? (
					<div className="mf-env-port">
						<span className="mf-env-port-label">Port:</span>
						<span className="mf-env-port-value">{port}</span>
					</div>
				) : null}
				<span className="mf-env-chevron mf-env-lucide mf-env-lucide--chevron" aria-hidden="true">
					{isOpen ? <ChevronUp /> : <ChevronDown />}
				</span>
			</div>
		</button>
	);
};

const MfEnvRemoteRow: React.FC<MfEnvRemoteRowProps> = ({ scope, entry: v, isOpen, onToggle }) => {
	const fallback = isFallbackRow(v);
	const portRaw = parseLocalPort(v.localUrl) ?? parseLocalPort(v.url);
	const port = fallback && portRaw ? portRaw : null;
	const localTarget = v.localUrl ?? (v.source === 'local' && v.url ? v.url : '—');
	const showTrace = shouldShowErrorTrace(v, fallback);
	const rowClass = 'mf-env-row' + (fallback ? ' mf-env-row--fallback' : '');

	return (
		<div className={rowClass}>
			<MfEnvRemoteRowToggle
				scope={scope}
				fallback={fallback}
				isOpen={isOpen}
				port={port}
				onToggle={onToggle}
			/>
			{isOpen ? (
				<MfEnvRemoteRowDetail
					entry={v}
					fallback={fallback}
					localTarget={localTarget}
					showTrace={showTrace}
				/>
			) : null}
		</div>
	);
};

export const MfEnvironmentStatusPanel: React.FC = () => {
	const [tick, setTick] = useState(0);
	const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
	const [dismissed, setDismissed] = useState(false);
	const [panelOpen, setPanelOpen] = useState(false);
	const [copyLabel, setCopyLabel] = useState('Copy debug JSON');
	const [networkLabel, setNetworkLabel] = useState('Open Network Tab');

	const refresh = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		if (typeof window === 'undefined' || getClientMode() !== 'development') {
			return undefined;
		}
		const onResolved = () => refresh();
		window.addEventListener('mf:remote-resolved', onResolved);
		const timer = window.setTimeout(refresh, 0);
		return () => {
			window.removeEventListener('mf:remote-resolved', onResolved);
			window.clearTimeout(timer);
		};
	}, [refresh]);

	const { visible, entries, fallbackCount } = useMemo(() => {
		const map = readMfRemoteResolution();
		if (!map) {
			return { visible: false, entries: [] as Array<[string, MfRemoteEntry]>, fallbackCount: 0 };
		}
		const ent = getResolutionEntries(map);
		const { visible: vis, fallbackCount: fc } = panelVisibility(ent);
		return { visible: vis, entries: ent, fallbackCount: fc };
		// `tick` is not read inside the memo; it intentionally invalidates when remotes resolve.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- bump on mf:remote-resolved
	}, [tick]);

	const toggleScope = (scope: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(scope)) {
				next.delete(scope);
			} else {
				next.add(scope);
			}
			return next;
		});
	};

	const copyDebugJson = (): void => {
		const map = readMfRemoteResolution();
		const payload = {
			capturedAt: new Date().toISOString(),
			mode: getClientMode(),
			remotes: map ?? {},
		};
		const json = JSON.stringify(payload, null, 2);
		void navigator.clipboard.writeText(json).then(
			() => {
				setCopyLabel('Copied!');
				window.setTimeout(() => setCopyLabel('Copy debug JSON'), 1600);
			},
			() => {
				window.prompt('Copy debug JSON:', json);
			},
		);
	};

	const copyNetworkTip = () => {
		void navigator.clipboard.writeText(networkTip).then(
			() => {
				setNetworkLabel('Tip copied');
				window.setTimeout(() => setNetworkLabel('Open Network Tab'), 1600);
			},
			() => {
				window.alert(networkTip);
			},
		);
	};

	if (
		typeof document === 'undefined' ||
		getClientMode() !== 'development' ||
		dismissed ||
		!visible
	) {
		return null;
	}

	const subtitle =
		fallbackCount === 1
			? '1 app running from remote fallback'
			: `${fallbackCount} apps running from remote fallback`;

	const openPanel = () => {
		setPanelOpen(true);
		setExpanded(new Set());
	};

	const widget = (
		<button
			type="button"
			className="mf-env-widget"
			onClick={openPanel}
			aria-expanded={panelOpen ? 'true' : 'false'}
			aria-controls="mf-remote-fallback-banner"
		>
			<span className="mf-env-widget-icon mf-env-lucide mf-env-lucide--md" aria-hidden="true">
				<Terminal />
			</span>
		</button>
	);

	const panel = (
		<div id="mf-remote-fallback-banner" className="mf-env-status">
			<header className="mf-env-header">
				<div className="mf-env-header-left">
					<div className="mf-env-icon mf-env-lucide mf-env-lucide--lg" aria-hidden="true">
						<Terminal />
					</div>
					<div>
						<h2 className="mf-env-title">Environment Status</h2>
						<p className="mf-env-subtitle">{subtitle}</p>
					</div>
				</div>
				<div className="mf-env-badge">LOCAL_ENV: {getClientMode()}</div>
			</header>

			<div className="mf-env-list">
				{entries.map(([scope, v]) => (
					<MfEnvRemoteRow
						key={scope}
						scope={scope}
						entry={v}
						isOpen={expanded.has(scope)}
						onToggle={() => toggleScope(scope)}
					/>
				))}
			</div>

			<footer className="mf-env-footer">
				<div className="mf-env-footer-left">
					<button type="button" className="mf-env-link-btn" onClick={copyDebugJson}>
						<span className="mf-env-link-icon mf-env-lucide mf-env-lucide--xs" aria-hidden="true">
							<Copy />
						</span>
						{copyLabel}
					</button>
					<button type="button" className="mf-env-link-btn" onClick={copyNetworkTip}>
						{networkLabel}
					</button>
				</div>
				<button
					type="button"
					className="mf-env-dismiss"
					onClick={() => {
						setDismissed(true);
						setPanelOpen(false);
					}}
				>
					Dismiss
				</button>
			</footer>
		</div>
	);

	return createPortal(panelOpen ? panel : widget, document.body);
};
