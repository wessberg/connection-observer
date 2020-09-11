export function isConnected(node: Node): boolean {
	if ("isConnected" in Node.prototype) return node.isConnected;

	return node.ownerDocument == null || !(node.ownerDocument.compareDocumentPosition(node) & node.DOCUMENT_POSITION_DISCONNECTED);
}
