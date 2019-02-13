<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/connection-observer/master/documentation/asset/logo.png" height="110"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> An API that provides a way to asynchronously observe the connectedness of a target Node inside a document

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fconnection-observer?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fconnection-observer.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fconnection-observer"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fconnection-observer.svg"    /></a>
<a href="https://david-dm.org/wessberg/connection-observer"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fconnection-observer.svg"    /></a>
<a href="https://github.com/wessberg/connection-observer/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fconnection-observer.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

`ConnectionObserver` is a tiny API that provides a way to asynchronously observe the connectedness of a target Node inside a document.

With `ConnectionObserver`, you have a low-level building block that can be used to build functionality on top of when you need to
perform work when a Node lives inside the DOM, and/or perform work when it becomes detached.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- Familiar API: Follows the same conventions as [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver), and [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- Asynchronous: Entries are batched together as microtasks
- Tiny
- Performant

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Usage](#usage)
  - [Constructing a ConnectionObserver](#constructing-a-connectionobserver)
  - [Observing Nodes for connectedness](#observing-nodes-for-connectedness)
  - [Disconnecting the ConnectionObserver](#disconnecting-the-connectionobserver)
  - [Taking ConnectionRecords immediately](#taking-connectionrecords-immediately)
- [API reference](#api-reference)
  - [ConnectionObserver](#connectionobserver)
  - [ConnectionCallback](#connectioncallback)
  - [ConnectionRecord](#connectionrecord)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [Backers](#backers)
  - [Patreon](#patreon)
- [FAQ](#faq)
  - [Why can't you just use MutationObservers for this](#why-cant-you-just-use-mutationobservers-for-this)
  - [Why wouldn't you use MutationEvents for this](#why-wouldnt-you-use-mutationevents-for-this)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### NPM

```
$ npm install @wessberg/connection-observer
```

### Yarn

```
$ yarn add @wessberg/connection-observer
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

If you are familiar with the family of observers such as `MutationObserver` and `IntersectionObserver`, you will feel right at home
with `ConnectionObserver`. Not only is the API very similar, it is also asynchronous and batches together records on the microtask queue.

```typescript
import {ConnectionObserver} from "@wessberg/connection-observer";

// Hook up a new ConnectionObserver
const observer = new ConnectionObserver(entries => {
	// For each entry, print the connection state as well as the target node to the console
	for (const {connected, target} of entries) {
		console.log("target:", target);
		console.log("connected:", connected);
	}
});

// Observe 'someElement' for connectedness
observer.observe(someElement);

// Eventually disconnect the observer when you are done observing elements for connectedness
observer.disconnect();
```

### Constructing a ConnectionObserver

The `ConnectionObserver` constructor creates and returns a new observer which invokes a specified callback when there are new connectedness entries available.
If you don't call provide any Nodes to the `observe` method on the `ConnectionObserver` instance, the callback will never be called since no Nodes will be observed for connectedness.

```typescript
const connectionObserver = new ConnectionObserver(callback);
```

### Observing Nodes for connectedness

The `ConnectionObserver` method `observe` configures the `ConnectionObserver` callback to begin receiving notifications of changes to the connectedness of the given Node(s).
The callback will be invoked immediately with the connectedness of the observed Node(s).

```typescript
connectionObserver.observe(target);
```

### Disconnecting the ConnectionObserver

The `ConnectionObserver` method `disconnect` will stop watching for the connectedness of all observed Nodes such that the callback won't be triggered any longer.

```typescript
connectionObserver.disconnect();
```

### Taking ConnectionRecords immediately

`ConnectionObserver` is asynchronous which means that `ConnectionEntries` will be batched together and be provided to the callback given in the constructor (see [this section](#constructing-a-connectionobserver)) as a microtask.
The method `takeRecords` returns the entries that are currently queued in the batch and haven't been processed yet, leaving the connection queue empty. This may be useful if you want to immediately fetch all pending connection records immediately before disconnecting the observer, so that any pending changes can be processed.

```typescript
const entries = connectionObserver.takeRecords();
```

## API reference

This section includes a more code-oriented introduction to the types and interfaces of `ConnectionObserver`

### ConnectionObserver

```typescript
class ConnectionObserver {
	[Symbol.toStringTag]: string;

	/**
	 * Constructs a new ConnectionObserver
	 * @param {ConnectionCallback} callback
	 */
	constructor(callback: ConnectionCallback);

	/**
	 * Observes the given target Node for connections/disconnections.
	 * @param {Node} target
	 */
	observe(target: Node): void;

	/**
	 * Takes the records immediately (instead of waiting for the next flush)
	 * @return {ConnectionRecord[]}
	 */
	takeRecords(): ConnectionRecord[];

	/**
	 * Disconnects the ConnectionObserver such that none of its callbacks will be invoked any longer
	 */
	disconnect(): void;
}
```

### ConnectionCallback

A `ConnectionCallback` must be provided to the constructor of [`ConnectionObserver`](#connectionobserver) and will be invoked when
there are new [ConnectionRecords](#connectionrecord) available.

```typescript
type ConnectionCallback = (entries: ConnectionRecord[], observer: IConnectionObserver) => void;
```

### ConnectionRecord

[ConnectionCallbacks](#connectioncallback) are invoked with an array of `ConnectionRecord`s. Those have the following members:

```typescript
interface ConnectionRecord {
	/**
	 * Whether or not the node is Connected
	 */
	readonly connected: boolean;

	/**
	 * The target Node
	 */
	readonly target: Node;
}
```

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   />                   |
| --------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br>[@FredWessberg](https://twitter.com/FredWessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, avatar, and Twitter handle listed here.

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Backers on Patreon" src="https://patreon-badge.herokuapp.com/11315442.png"  width="500"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

#### Why can't you just use MutationObservers for this

With [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), we can watch for changes being made to the DOM tree from any root,
but using it to watch for when an arbitrary Node is attached to or detached from the DOM is very hard since that requires tracking all [Shadow Roots](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

There is [an ongoing discussion](https://github.com/whatwg/dom/issues/533) about adding support for tracking connectedness of any Node via MutationObservers, and this library aims to render itself obsolete if and when
that becomes a reality in favor of a polyfill.

#### Why wouldn't you use MutationEvents for this

[MutationEvents](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) are deprecated and I would discourage you from using them.
Additionally, these were designed and implemented in browser before Shadow DOM v1 came to be, and they are somewhat unreliable for tracking the connectedness of Nodes inside of Shadow roots.
Additionally, they are synchronous which is bad for performance and has proven to be performance-killers in numerous benchmarks and investigations.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
