import {ConnectionRecord} from "../connection-observer/connection-record";

/**
 * A Map between Nodes and their ConnectionRecord callbacks
 * @type {Map<Node, (entry: ConnectionRecord) => void>}
 */
export const CONNECTION_RECORD_CALLBACK_MAP: Map<Node, (entry: ConnectionRecord) => void> = new Map();

/**
 * A WeakMap between Nodes and their last 'connected' value
 * @type {WeakMap<Node, boolean>}
 */
export const CONNECTION_RECORD_LAST_VALUE_MAP: WeakMap<Node, boolean> = new WeakMap();
