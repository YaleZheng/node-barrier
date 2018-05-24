"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const counter_1 = require("./counter");
class Barrier {
    constructor() {
        this._counter = new counter_1.Counter();
        this._timers = [];
        this._subBarriers = [];
        this._desc = '';
        this._isBlockFunc = null;
        this._computeBlockTimeInMills = null;
    }
    toString() {
        return `[desc: ${this._desc}]`;
    }
    increaseCounter() {
        this._counter.increase();
    }
    decreaseCounter() {
        this._counter.decrease();
    }
    zeroCounter() {
        this._counter.zero();
    }
    addSubBarrier(barrier) {
        if (this._subBarriers.indexOf(barrier) < 0) {
            this._subBarriers.push(barrier);
            this._counter.addSubCounter(barrier._counter);
        }
    }
    removeSubBarrier(barrier) {
        const idx = this._subBarriers.indexOf(barrier);
        if (idx >= 0) {
            this._subBarriers.splice(idx, 1);
        }
    }
    isBlock() {
        return this._isBlockFunc(this._counter);
    }
    computeBlockTimeInMills() {
        if (this.isBlock()) {
            return this._computeBlockTimeInMills(this._counter);
        }
        return 0;
    }
    addTimer(timer) {
        if (this._timers.indexOf(timer) < 0) {
            this._timers.push(timer);
        }
    }
    removeTimer(timer) {
        const idx = this._timers.indexOf(timer);
        if (idx >= 0) {
            this._timers.splice(idx, 1);
            timer.unref();
        }
    }
    release() {
        for (const timer of this._timers) {
            timer.unref();
        }
        this._timers = [];
        for (const barrier of this._subBarriers) {
            barrier.release();
        }
        this._subBarriers = [];
    }
}
exports.Barrier = Barrier;
