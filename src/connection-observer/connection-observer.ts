import {ConnectionCallback} from "./connection-callback";
import {CONNECTION_RECORD_CALLBACK_MAP, CONNECTION_RECORD_LAST_VALUE_MAP} from "../connection-record-callback-map/connection-record-callback-map";
import {ConnectionRecord} from "./connection-record";
import {IConnectionObserver} from "./i-connection-observer";
import {ConnectionObserverPrivateState} from "./connection-observer-private-state";
import {rootObserverQueue} from "../root-observer-queue/root-observer-queue";

// The private state of instantiated ConnectionObservers
const privateState: WeakMap<IConnectionObserver, ConnectionObserverPrivateState> = new WeakMap();

/**
 * An Observer that tracks the DOM-insertion state of observed nodes across Shadow boundaries.
 */
export class ConnectionObserver implements IConnectionObserver {
	constructor(callback: ConnectionCallback) {
		// Validate that a Callback is given
		if (callback === undefined) {
			throw new ReferenceError(`Failed to construct '${ConnectionObserver.name}': 1 argument required, but only 0 present.`);
		}

		// Validate that the given callback is in fact a function
		else if (typeof callback !== "function") {
			throw new TypeError(`Failed to construct '${ConnectionObserver.name}': The callback provided as parameter 1 is not a function.`);
		}

		/**
		 * The ConnectionRecord queue
		 * @type {Set<ConnectionRecord>}
		 */
		const queue: Set<ConnectionRecord> = new Set();

		/**
		 * The Set of all observed targets
		 * @type {Set<Node>}
		 */
		const observedTargets: Set<Node> = new Set();

		/**
		 * Whether a flush is scheduled
		 * @type {boolean}
		 */
		let scheduled: boolean = false;

		/**
		 * Whether the queue is currently being flushed
		 * @type {boolean}
		 */
		let flushing: boolean = false;

		/**
		 * Flushes the ConnectionRecord queue
		 */
		const flush = (): void => {
			flushing = true;
			const arr = [...queue];
			if (arr.length > 0) {
				callback(arr, this);
			}
			queue.clear();

			scheduled = false;
			flushing = false;
		};

		/**
		 * Schedules a new read/write
		 * batch if one isn't pending.
		 */
		const scheduleFlush = (): void => {
			if (!scheduled) {
				scheduled = true;
				nextMicrotask(flush);
			}
		};

		/**
		 * Enqueues the given function for the next microtask
		 * @param {CallableFunction} func
		 */
		const nextMicrotask = (func: CallableFunction): void => {
			if ("queueMicrotask" in window) queueMicrotask(func);
			else Promise.resolve().then(() => func());
		};

		/**
		 * Adds the given ConnectionRecord to the queue
		 * @param {ConnectionRecord} entry
		 */
		const addToQueue = (entry: ConnectionRecord): void => {
			queue.add(entry);

			if (!flushing) {
				scheduleFlush();
			}
		};

		/**
		 * Prepare the private state to store within the WeakMap
		 */
		privateState.set(this, {
			/**
			 * Clears the queue and returns the popped contents of it
			 * @return {ConnectionRecord[]}
			 */
			clearQueue() {
				const items = [...queue];
				queue.clear();
				return items;
			},

			/**
			 * Clears the observed targets
			 */
			clearObservedTargets() {
				for (const target of observedTargets) {
					CONNECTION_RECORD_CALLBACK_MAP.delete(target);
					CONNECTION_RECORD_LAST_VALUE_MAP.delete(target);
				}
				observedTargets.clear();
			},

			/**
			 * Adds the given target to the Set of observed targets
			 * @param {Node} target
			 */
			addObservedTarget(target: Node): void {
				observedTargets.add(target);

				// Take the initial 'isConnected' value
				const isConnected = target.isConnected;

				CONNECTION_RECORD_CALLBACK_MAP.set(target, addToQueue);
				CONNECTION_RECORD_LAST_VALUE_MAP.set(target, isConnected);

				// Add the initial connected value to the queue
				addToQueue({connected: isConnected, target});
			}
		});
	}

	/**
	 * The Symbol.@@toStringTag value
	 * @type {string}
	 */
	public get [Symbol.toStringTag]() {
		return `ConnectionObserver`;
	}

	/**
	 * Observes the given target Node for connections/disconnections.
	 * @public
	 * @param {Node} target
	 */
	public observe(target: Node): void {
		// Ensure that a target is given
		if (target === undefined) {
			throw new ReferenceError(`Failed to execute '${this.observe.name}' on '${ConnectionObserver.name}': 1 argument required, but only 0 present.`);
		}

		// Ensure that it is in fact a Node
		else if (!(target instanceof Node)) {
			throw new TypeError(`Failed to execute '${this.observe.name}' on '${ConnectionObserver.name}': parameter 1 is not of type 'Node'.`);
		}

		// Now that a target node is to observed, run the root observer queue (if it isn't already running)
		rootObserverQueue.run();

		const state = privateState.get(this)!;

		// Mark the target as observed
		state.addObservedTarget(target);
	}

	/**
	 * Takes the records immediately (instead of waiting for the next flush)
	 * @public
	 * @return {ConnectionRecord[]}
	 */
	public takeRecords(): ConnectionRecord[] {
		const state = privateState.get(this)!;
		return state.clearQueue();
	}

	/**
	 * Disconnects the ConnectionObserver such that none of its callbacks will be invoked any longer
	 * @public
	 */
	public disconnect(): void {
		const state = privateState.get(this)!;
		state.clearObservedTargets();
	}
}
