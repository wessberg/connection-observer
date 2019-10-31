import {CONNECTION_OBSERVER_INTERNALS_MAP} from "../../connection-observer/connection-observer-internals";

/**
 * A callback that will be invoked for all MutationRecords
 * @param {MutationRecord[]} mutations
 */
export const mutationCallback: MutationCallback = (mutations): void => {
	for (const mutation of mutations) {
		if (mutation.type !== "childList") continue;

		for (const observer of CONNECTION_OBSERVER_INTERNALS_MAP.values()) {
			for (const target of observer.observedTargets) {
				if (typeof target === "string") {
					observer.queryRootAndHandleMutationChanges(mutation.target, target);
				} else {
					observer.handleMutationChange([target]);
				}
			}
		}
	}
};
