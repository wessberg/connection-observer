import {MUTATION_OBSERVER_INIT} from "../mutation-observer/mutation-observer-init/mutation-observer-init";
import {mutationCallback} from "../mutation-observer/mutation-callback/mutation-callback";

/**
 * The Set of all observed roots
 */
export const OBSERVED_ROOTS = new Set<Node>();

export const observeRoot = (() => {
	let instance: MutationObserver | undefined;

	/**
	 * Observes the given root for changes to its childList (including its subtree)
	 */
	return function (root: Node): void {
		if (OBSERVED_ROOTS.has(root)) return;
		OBSERVED_ROOTS.add(root);

		if (instance == null) {
			// Prepare MutationObserver right off the bat. Reuse the same instance
			instance = new MutationObserver(mutationCallback);
		}
		instance.observe(root, MUTATION_OBSERVER_INIT);
	};
})();
