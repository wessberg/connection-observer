import {isShady} from "./is-shady";

/**
 * Converts a NodeList to an array.
 * It may be as easy as spreading it if the environment supports iterable DOM Collections
 */
function nodeListToArray<T extends Node>(nodeList: NodeListOf<T>): T[] {
	if (typeof Symbol !== "undefined" && nodeList[Symbol.iterator] != null) {
		return [...nodeList];
	} else {
		const arr: T[] = [];
		for (let i = 0; i < nodeList.length; i++) {
			arr[i] = nodeList[i];
		}
		return arr;
	}
}

/**
 * Queries the given root if possible and returns an array of Nodes
 * matching that query
 */
export function queryRoot(root: Node | Element, query: string): Set<Node> {
	if (isShady()) {
		return new Set(nodeListToArray(window.ShadyDOM!.nativeMethods.querySelectorAll.call(document.documentElement, query)));
	}
	return new Set(!("querySelectorAll" in root) ? [] : nodeListToArray(root.querySelectorAll(query)));
}
