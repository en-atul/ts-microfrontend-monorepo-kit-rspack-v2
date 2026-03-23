import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
	(global as typeof globalThis & { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
	(global as typeof globalThis & { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
}
