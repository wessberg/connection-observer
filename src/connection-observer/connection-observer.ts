import {ConnectionCallback} from "./connection-callback";
import {ConnectionRecord} from "./connection-record";
import {IConnectionObserver} from "./i-connection-observer";
import {CONNECTION_OBSERVER_INTERNALS_MAP, initializeConnectionObserver} from "./connection-observer-internals";

/**
 * An Observer that tracks the DOM-insertion state of observed nodes across Shadow boundaries.
 */
export class ConnectionObserver implements IConnectionObserver {
	constructor(callback: ConnectionCallback) {
		if (new.target === undefined) {
			throw new TypeError(`Constructor ${ConnectionObserver.name} requires 'new'`);
		}

		// Validate that a Callback is given
		if (callback === undefined) {
			throw new ReferenceError(`Failed to construct '${ConnectionObserver.name}': 1 argument required, but only 0 present.`);
		}

		// Validate that the given callback is in fact a function
		else if (typeof callback !== "function") {
			throw new TypeError(`Failed to construct '${ConnectionObserver.name}': The callback provided as parameter 1 is not a function.`);
		}

		// Add this ConnectionObserver to the Set of ConnectionObservers
		initializeConnectionObserver(this, callback);
	}

	/**
	 * The Symbol.@@toStringTag value
	 * @type {string}
	 */
	public get [Symbol.toStringTag]() {
		return `ConnectionObserver`;
	}

	/**
	 * Observe the given node or query selector for connections/disconnections.
	 * If given a Node, that specific Node will be observed. If given a query selector, such
	 * as for example "img[data-some-attr]", for each new MutationRecord, the query selector
	 * will be executed and the matched nodes will be observed for connections/disconnections
	 * @param {string} target
	 * @example {observe("img[data-some-attr]")}
	 */
	public observe(target: Node | string): void {
		// Ensure that a target is given
		if (target === undefined) {
			throw new ReferenceError(`Failed to execute '${this.observe.name}' on '${ConnectionObserver.name}': 1 argument required, but only 0 present.`);
		}

		// Ensure that it is in fact a Node
		else if (typeof target !== "string" && !(target instanceof Node)) {
			throw new TypeError(
				`Failed to execute '${this.observe.name}' on '${ConnectionObserver.name}': parameter 1 is not of type 'Node' or a DOMString.`
			);
		}

		const internals = CONNECTION_OBSERVER_INTERNALS_MAP.get(this);
		if (internals == null) return;

		// Mark the target as observed
		internals.addObservedTarget(target);
	}

	/**
	 * Takes the records immediately (instead of waiting for the next flush)
	 * @public
	 * @return {ConnectionRecord[]}
	 */
	public takeRecords(): ConnectionRecord[] {
		const internals = CONNECTION_OBSERVER_INTERNALS_MAP.get(this);
		if (internals == null) return [];
		return internals.clearQueue();
	}

	/**
	 * Disconnects the ConnectionObserver such that none of its callbacks will be invoked any longer
	 * @public
	 */
	public disconnect(): void {
		const internals = CONNECTION_OBSERVER_INTERNALS_MAP.get(this);
		if (internals == null) return;
		internals.clearObservedTargets();
	}
}
