import {ORIGINAL_ATTACH_SHADOW} from "../original/attach-shadow";

/**
 * Patches Element.prototype.attachShadow such that it can be tracked with root-level MutationObservers
 */
export function patchElementPrototypeAttachShadow (callback: (node: ShadowRoot) => void): void {
	// If Shadow DOM is not available, there's nothing to patch
	if (ORIGINAL_ATTACH_SHADOW == null) return;

	Element.prototype.attachShadow = function (this: Element, shadowRootInitDict: ShadowRootInit): ShadowRoot {
		const shadowRoot = ORIGINAL_ATTACH_SHADOW.call(this, shadowRootInitDict);
		// Invoke the callback with the ShadowRoot
		callback(shadowRoot);

		// Return the new ShadowRoot
		return shadowRoot;
	};
}
