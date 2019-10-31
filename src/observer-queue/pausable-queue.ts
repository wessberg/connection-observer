export interface PausableQueue {
	isRunning(): boolean;
	schedule(node: Node): void;
	stop(): void;
	run(): void;
}
