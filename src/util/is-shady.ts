declare global {
	interface Window {
		ShadyDOM?: {
			nativeMethods: ParentNode;
		};
	}
}

/**
 * Returns true if the environment is relying on the ShadyDOM polyfill.
 */
export function isShady(): boolean {
	return typeof window.ShadyDOM !== "undefined" && typeof ShadowRoot !== "undefined";
}

/**
 * Returns true if the environment supports ShadowRoots
 */
export function supportsShadowRoots(): boolean {
	return typeof ShadowRoot !== "undefined";
}
