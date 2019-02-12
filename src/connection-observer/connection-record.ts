export interface ConnectionRecord {
	/**
	 * Whether or not the node is Connected
	 */
	readonly connected: boolean;

	/**
	 * The target Node
	 */
	readonly target: Node;
}
