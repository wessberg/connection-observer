/**
 * Enqueues the given function for the next microtask
 * @param {CallableFunction} func
 */
export const nextMicrotask = (func: CallableFunction): void => {
	if (typeof queueMicrotask !== "undefined") queueMicrotask(func);
	else if (typeof Promise !== "undefined") Promise.resolve().then(() => func());
	else setTimeout(() => func(), 0);
};
