import {PausableQueue} from "./pausable-queue";

/**
 * Creates a PausableQueue.
 * @param {(node: Node) => void} job
 * @param {Node[]} queueItems
 * @return {PausableQueue}
 */
export function createPausableQueue(job: (node: Node) => void, ...queueItems: Node[]): PausableQueue {
	const queue: Set<Node> = new Set(queueItems);
	let running = false;

	const flush = () => {
		for (const queuedNode of queue) {
			job(queuedNode);
		}

		// Clear the queue
		queue.clear();
	};

	return {
		isRunning() {
			return running;
		},
		schedule(node: Node): void {
			queue.add(node);
			if (running) {
				flush();
			}
		},
		stop(): void {
			running = false;
		},
		run(): void {
			// If the queue is already running, do nothing
			if (running) return;
			running = true;
			flush();
		}
	};
}
