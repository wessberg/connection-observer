/**
 * Enqueues the given function for the next microtask
 */
export const nextMicrotask = (func: () => void): void => {
	if (typeof queueMicrotask !== "undefined") queueMicrotask(func);
	else if (typeof Promise !== "undefined") Promise.resolve().then(() => func());
	else setTimeout(() => func(), 0);
};
