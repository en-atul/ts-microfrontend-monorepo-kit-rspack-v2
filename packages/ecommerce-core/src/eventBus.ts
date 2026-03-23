import type { EcomEventMap } from './types';

type EventName = keyof EcomEventMap;

const EVENT_NAMESPACE = 'mfe:ecom';

export function emitEvent<TEvent extends EventName>(name: TEvent, detail: EcomEventMap[TEvent]) {
	window.dispatchEvent(
		new CustomEvent(`${EVENT_NAMESPACE}:${name}`, {
			detail,
		}),
	);
}

export function onEvent<TEvent extends EventName>(
	name: TEvent,
	handler: (detail: EcomEventMap[TEvent]) => void,
) {
	const listener = (event: Event) => {
		handler((event as CustomEvent<EcomEventMap[TEvent]>).detail);
	};
	window.addEventListener(`${EVENT_NAMESPACE}:${name}`, listener);
	return () => window.removeEventListener(`${EVENT_NAMESPACE}:${name}`, listener);
}
