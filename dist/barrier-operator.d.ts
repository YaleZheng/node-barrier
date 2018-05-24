import { Barrier } from "./barrier";
declare function wait(barrier: Barrier): Promise<void>;
declare function and(...barriers: Barrier[]): Barrier;
declare function or(...barriers: Barrier[]): Barrier;
export { and, or, wait };
