import { Counter } from "./counter";

class Barrier {
    _counter: Counter
    _timers: NodeJS.Timer[]
    _subBarriers: Barrier[]
    _desc: string
    _isBlockFunc: (counter: Counter) => boolean
    _computeBlockTimeInMills: (counter: Counter) => number

    constructor() {
        this._counter = new Counter()
        this._timers = []
        this._subBarriers = []
        this._desc = ''
        this._isBlockFunc = null
        this._computeBlockTimeInMills = null
    }

    toString() {
        return `[desc: ${this._desc}]`
    }

    increaseCounter() {
        this._counter.increase()
    }

    decreaseCounter() {
        this._counter.decrease()
    }

    zeroCounter() {
        this._counter.zero()
    }

    addSubBarrier(barrier: Barrier) {
        if (this._subBarriers.indexOf(barrier) < 0) {
            this._subBarriers.push(barrier)
            this._counter.addSubCounter(barrier._counter)
        }
    }

    removeSubBarrier(barrier: Barrier) {
        const idx = this._subBarriers.indexOf(barrier)
        if (idx >= 0) {
            this._subBarriers.splice(idx, 1)
        }
    }

    isBlock() {
        return this._isBlockFunc(this._counter)
    }

    computeBlockTimeInMills() {
        if (this.isBlock()) {
            return this._computeBlockTimeInMills(this._counter)
        }

        return 0
    }

    addTimer(timer: NodeJS.Timer) {
        if (this._timers.indexOf(timer) < 0) {
            this._timers.push(timer)
        }
    }

    removeTimer(timer: NodeJS.Timer) {
        const idx = this._timers.indexOf(timer)
        if (idx >= 0) {
            this._timers.splice(idx, 1)
            timer.unref()
        }
    }

    release() {
        for (const timer of this._timers) {
            timer.unref()
        }
        this._timers = []
        for (const barrier of this._subBarriers) {
            barrier.release()
        }
        this._subBarriers = []
    }
}

export {
    Barrier
}