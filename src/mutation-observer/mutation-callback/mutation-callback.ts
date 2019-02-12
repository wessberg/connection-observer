import {CONNECTION_RECORD_CALLBACK_MAP, CONNECTION_RECORD_LAST_VALUE_MAP} from "../../connection-record-callback-map/connection-record-callback-map";
/**
 * A callback that will be invoked for all MutationRecords
 * @param {MutationRecord[]} mutations
 */
export const mutationCallback: MutationCallback = (mutations): void => {
	const hasChildListMutation = mutations.some(({type}) => type === "childList");
	if (!hasChildListMutation) return;

	for (const [node, observer] of CONNECTION_RECORD_CALLBACK_MAP) {

		// Take the cached last connected value of this particular Node
		const lastValue = CONNECTION_RECORD_LAST_VALUE_MAP.get(node);

		// Check if it is connected
		const isConnected = node.isConnected;

		// If it isn't equal to the last value, or if there is no last value, invoke the observer
		if (lastValue !== isConnected) {
			CONNECTION_RECORD_LAST_VALUE_MAP.set(node, isConnected);

			observer({
				connected: isConnected,
				target: node
			});
		}
	}
};
