import {ConnectionRecord} from "./connection-record";
import {ConnectionObserver} from "./connection-observer";
import {ConnectionCallback} from "./connection-callback";
import {nextMicrotask} from "../util/next-microtask";
import {IConnectionObserver} from "./i-connection-observer";
import {OBSERVED_ROOTS} from "../observe-root/observe-root";
import {queryRoot} from "../util/query-root";
import {mergeNodes} from "../util/merge-nodes";

export const CONNECTION_OBSERVER_INTERNALS_MAP: Map<IConnectionObserver, ConnectionObserverInternals> = new Map();

export interface ConnectionObserverInternals {
	/**
	 * The Set of all observed targets
	 * @type {Set<Node|string>}
	 */
	readonly observedTargets: Set<Node | string>;

	/**
	 * Executes the given query on the given root and
	 * handles all of the nodes, including any that has been
	 * matched previously, as mutations
	 * @param {Node} root
	 * @param {string} query
	 */
	queryRootAndHandleMutationChanges(root: Node, query: string): void;

	/**
	 * Handles a mutation change for a the given target Nodes
	 * @param {Iterable<Node>} targetNodes
	 */
	handleMutationChange(targetNodes: Node[]): void;

	/**
	 * Clears the queue and returns the popped contents of it
	 * @return {ConnectionRecord[]}
	 */
	clearQueue(): ConnectionRecord[];

	/**
	 * Clears the observed targets
	 */
	clearObservedTargets(): void;

	/**
	 * Adds the given target to the Set of observed targets
	 * @param {Node|string} target
	 */
	addObservedTarget(target: Node | string): void;
}

export function initializeConnectionObserver(observer: ConnectionObserver, callback: ConnectionCallback): void {
	/**
	 * The ConnectionRecord queue
	 * @type {Set<ConnectionRecord>}
	 */
	const queue: Set<ConnectionRecord> = new Set();

	/**
	 * The Set of all observed targets
	 * @type {Set<Node|string>}
	 */
	const observedTargets: Set<Node | string> = new Set();

	/**
	 * A Map between query selectors and Nodes that matches them
	 * @type {Map<string, Set<Node>>}
	 */
	const querySelectorToMatchedNodesMap: Map<string, Set<Node>> = new Map();

	/**
	 * A WeakMap between Nodes and their last 'connected' value
	 * @type {WeakMap<Node, boolean>}
	 */
	const nodeToLastConnectionValueMap: WeakMap<Node, boolean> = new WeakMap();

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
			callback(arr, observer);
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
	 * Clears the queue and returns the popped contents of it
	 * @return {ConnectionRecord[]}
	 */
	const clearQueue = (): ConnectionRecord[] => {
		const items = [...queue];
		queue.clear();
		return items;
	};

	/**
	 * Clears the observed targets
	 */
	const clearObservedTargets = (): void => {
		observedTargets.clear();
	};

	/**
	 * Executes the given query on the given root and
	 * handles all of the nodes, including any that has been
	 * matched previously, as mutations
	 * @param {Node} root
	 * @param {string} query
	 */
	const queryRootAndHandleMutationChanges = (root: Node, query: string): void => {
		// Check which nodes currently match the query
		const currentNodes = queryRoot(root, query);

		// Combine the nodes matching the query with the ones that did did so previously
		const mergedNodes = mergeNodes(
			currentNodes,
			// Whatever nodes that has been matched for the query on the target previously
			querySelectorToMatchedNodesMap.get(query)
		);
		handleMutationChange(mergedNodes);

		// Update the observed nodes such that they only consider the currently matched nodes
		querySelectorToMatchedNodesMap.set(query, currentNodes);
	};

	/**
	 * Handles a mutation change for a the given target Nodes
	 * @param {Iterable<Node>} targetNodes
	 */
	const handleMutationChange = (targetNodes: Iterable<Node>): void => {
		for (const targetNode of targetNodes) {
			// Take the cached last connected value of this particular Node
			const lastValue = nodeToLastConnectionValueMap.get(targetNode);

			// Check if it is connected
			const isConnected = targetNode.isConnected;

			// If it isn't equal to the last value, or if there is no last value, invoke the observer
			if (lastValue !== isConnected) {
				nodeToLastConnectionValueMap.set(targetNode, isConnected);
				addToQueue({
					connected: isConnected,
					target: targetNode
				});
			}
		}
	};

	/**
	 * Adds the given target to the Set of observed targets
	 * @param {Node|string} target
	 */
	const addObservedTarget = (target: Node | string): void => {
		observedTargets.add(target);

		if (typeof target !== "string") {
			handleMutationChange([target]);
		} else {
			for (const root of OBSERVED_ROOTS) {
				queryRootAndHandleMutationChanges(root, target);
			}
		}
	};

	const internals: ConnectionObserverInternals = {
		observedTargets,
		queryRootAndHandleMutationChanges,
		handleMutationChange,
		addObservedTarget,
		clearObservedTargets,
		clearQueue
	};

	CONNECTION_OBSERVER_INTERNALS_MAP.set(observer, internals);
}
