import {ConnectionRecord} from "./connection-record";

export interface IConnectionObserver {
	[Symbol.toStringTag]: string;

	/**
	 * Observe the given node query selector for connections/disconnections.
	 * If given a Node, that specific Node will be observed. If given a query selector, such
	 * as for example "img[data-some-attr]", for each new MutationRecord, the query selector
	 * will be executed and the matched nodes will be observed for connections/disconnections
	 * @param {Node|string} target
	 */
	observe(target: Node | string): void;

	/**
	 * Takes the records immediately (instead of waiting for the next flush)
	 * @return {ConnectionRecord[]}
	 */
	takeRecords(): ConnectionRecord[];

	/**
	 * Disconnects the ConnectionObserver such that none of its callbacks will be invoked any longer
	 */
	disconnect(): void;
}
