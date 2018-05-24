declare class Counter {
    private _count;
    private _subCounters;
    constructor();
    toString(): string;
    increase(): void;
    decrease(): void;
    zero(): void;
    getCount(): number;
    addSubCounter(counter: Counter): void;
    removeSubCounter(counter: Counter): void;
}
export { Counter };
