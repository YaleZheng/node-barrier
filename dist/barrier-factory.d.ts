import { Barrier } from "./barrier";
declare class BarrierIntervalOption {
    cleanIntervalInMills: number;
    maxCount: number;
}
declare function makeBarrierInterval(opt: BarrierIntervalOption): Barrier;
export { makeBarrierInterval, BarrierIntervalOption };
