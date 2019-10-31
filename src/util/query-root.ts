/**
 * Queries the given root if possible and returns an array of Nodes
 * matching that query
 * @param {Node|Element} root
 * @param {string} query
 * @returns {Set<Node>}
 */
export function queryRoot(root: Node | Element, query: string): Set<Node> {
	return new Set(!("querySelectorAll" in root) ? [] : [...root.querySelectorAll(query)]);
}
