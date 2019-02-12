import {ConnectionRecord} from "./connection-record";

export interface IConnectionObserver {
	[Symbol.toStringTag]: string;

	/**
	 * Observes the given target Node for connections/disconnections.
	 * @param {Node} target
	 */
	observe(target: Node): void;

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
