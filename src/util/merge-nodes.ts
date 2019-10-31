/**
 * Merges the given iterables of Nodes into one
 * @param {Iterable<T>} a
 * @param {Iterable<U>} b
 * @returns {Set<T|U>}
 */
export function mergeNodes<T extends Node, U extends Node>(a: Iterable<T> | undefined, b: Iterable<U> | undefined): Set<T | U> {
	return new Set([...(a == null ? [] : a), ...(b == null ? [] : b)]);
}
