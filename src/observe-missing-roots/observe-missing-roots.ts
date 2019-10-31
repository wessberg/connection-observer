import {observeRoot} from "../observe-root/observe-root";

function isDocumentOrShadowRoot(root: Node | DocumentOrShadowRoot): root is DocumentOrShadowRoot {
	return "activeElement" in root;
}

export function observeMissingRoots(root: Node | Element = document.documentElement): void {
	if (isDocumentOrShadowRoot(root)) {
		observeRoot(root);
	}
	const childNodes = root.childNodes;
	const shadowRoot = "shadowRoot" in root && root.shadowRoot != null ? [root.shadowRoot] : [];

	for (const node of [...childNodes, ...shadowRoot]) {
		observeMissingRoots(node);
	}
}
