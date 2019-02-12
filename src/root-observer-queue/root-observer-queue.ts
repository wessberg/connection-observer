import {createPausableQueue} from "../observer-queue/create-pausable-queue";
import {observeRoot} from "../observe-root/observe-root";

// Creates a pausable queue and pass document.documentElement as the initial queue payload
export const rootObserverQueue = createPausableQueue(observeRoot, document.documentElement);