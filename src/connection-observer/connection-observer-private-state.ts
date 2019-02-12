import {ConnectionRecord} from "./connection-record";

export interface ConnectionObserverPrivateState {
	/**
	 * Clears the queue and returns the popped contents of it
	 * @return {ConnectionRecord[]}
	 */
	clearQueue (): ConnectionRecord[];

	/**
	 * Clears the observed targets
	 */
	clearObservedTargets (): void;

	/**
	 * Adds the given target to the Set of observed targets
	 * @param {Node} target
	 */
	addObservedTarget (target: Node): void;
}
