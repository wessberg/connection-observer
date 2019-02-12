import {patchElementPrototypeAttachShadow} from "./patch/attach-shadow";
import {rootObserverQueue} from "./root-observer-queue/root-observer-queue";

// Patch attachShadow such that we can track Shadow roots. Pass new ShadowRoots on to the root observer queue
patchElementPrototypeAttachShadow(rootObserverQueue.schedule.bind(rootObserverQueue));

export {ConnectionObserver} from "./connection-observer/connection-observer";
export {ConnectionCallback} from "./connection-observer/connection-callback";
export {ConnectionRecord} from "./connection-observer/connection-record";
export {IConnectionObserver} from "./connection-observer/i-connection-observer";