export interface PausableQueue {
	readonly running: boolean;
	schedule (node: Node): void;
	stop (): void;
	run (): void;
}