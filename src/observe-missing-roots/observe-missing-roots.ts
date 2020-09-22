import {observeRoot} from "../observe-root/observe-root";
import {isShady, supportsShadowRoots} from "../util/is-shady";

function isDocumentOrShadowRoot(root: Node | DocumentOrShadowRoot): root is DocumentOrShadowRoot {
	return "activeElement" in root;
}

export function observeMissingRoots(root: Node | Element = document.documentElement): void {
	if (isDocumentOrShadowRoot(root)) {
		observeRoot(root);
	}

	// When using the ShadyDOM, we don't need to find all deep roots, but can instead rely on the native/original
	// declaration of querySelectorAll.
	if (isShady() && root instanceof ShadowRoot) return;

	// If the browser doesn't support Shadow Roots (polyfilled or not), there's no point in applying additional work at this point
	if (!supportsShadowRoots()) return;

	const childNodes = root.childNodes;
	const shadowRoot = "shadowRoot" in root && root.shadowRoot != null ? [root.shadowRoot] : [];

	for (const node of [...childNodes, ...shadowRoot]) {
		observeMissingRoots(node);
	}
}
