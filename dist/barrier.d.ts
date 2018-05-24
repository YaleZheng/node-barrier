/// <reference types="node" />
import { Counter } from "./counter";
declare class Barrier {
    _counter: Counter;
    _timers: NodeJS.Timer[];
    _subBarriers: Barrier[];
    _desc: string;
    _isBlockFunc: (counter: Counter) => boolean;
    _computeBlockTimeInMills: (counter: Counter) => number;
    constructor();
    toString(): string;
    increaseCounter(): void;
    decreaseCounter(): void;
    zeroCounter(): void;
    addSubBarrier(barrier: Barrier): void;
    removeSubBarrier(barrier: Barrier): void;
    isBlock(): boolean;
    computeBlockTimeInMills(): number;
    addTimer(timer: NodeJS.Timer): void;
    removeTimer(timer: NodeJS.Timer): void;
    release(): void;
}
export { Barrier };
