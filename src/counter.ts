import { format } from "util";

class Counter {
    private _count: number
    private _subCounters: Counter[]

    constructor() {
        this._count = 0
        this._subCounters = []
    }

    toString() {
        return format('[count: %d subCounterCount: %d]', this._count, this._subCounters.length)
    }

    increase() {
        this._count = this._count + 1
        for (const counter of this._subCounters) {
            counter.increase()
        }
    }

    decrease() {
        this._count = this._count - 1
        for (const counter of this._subCounters) {
            counter.decrease()
        }
    }

    zero() {
        this._count = 0
        for (const counter of this._subCounters) {
            counter.zero()
        }
    }

    getCount() {
        return this._count
    }

    addSubCounter(counter: Counter) {
        if (this._subCounters.indexOf(counter) < 0) {
            this._subCounters.push(counter)
        }
    }

    removeSubCounter(counter: Counter) {
        const idx = this._subCounters.indexOf(counter)
        if (idx >= 0) {
            this._subCounters.splice(idx, 1)
        }
    }
}

export {
    Counter
}