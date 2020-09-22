import {ORIGINAL_ATTACH_SHADOW} from "../original/attach-shadow";
import {isShady} from "../util/is-shady";

/**
 * Patches Element.prototype.attachShadow such that it can be tracked with root-level MutationObservers
 */
export function patchElementPrototypeAttachShadow(callback: (node: ShadowRoot) => void): void {
	// If Shadow DOM is not available, or if it is based on the ShadyDOM polyfill, there's nothing (or no need) to patch
	if (ORIGINAL_ATTACH_SHADOW == null || isShady()) return;

	Element.prototype.attachShadow = function (this: Element, shadowRootInitDict: ShadowRootInit): ShadowRoot {
		const shadowRoot = ORIGINAL_ATTACH_SHADOW.call(this, shadowRootInitDict);
		// Invoke the callback with the ShadowRoot
		callback(shadowRoot);

		// Return the new ShadowRoot
		return shadowRoot;
	};
}
