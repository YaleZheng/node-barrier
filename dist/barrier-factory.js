"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const barrier_1 = require("./barrier");
const util_1 = require("util");
const logger_1 = require("./logger");
class BarrierIntervalOption {
}
exports.BarrierIntervalOption = BarrierIntervalOption;
function makeBarrierInterval(opt) {
    if (opt.cleanIntervalInMills <= 0) {
        logger_1.logger.warn('fail to makeBarrierInterval with reason: "%s"', 'opt.cleanIntervalInMills must not empty');
        return null;
    }
    if (opt.maxCount <= 0) {
        logger_1.logger.warn('fail to makeBarrierInterval with reason: "%s"', 'opt.maxCount must greater then 0');
        return null;
    }
    const barrier = new barrier_1.Barrier();
    barrier._desc = util_1.format('[type: %s, cleanIntervalInMills: %d maxCount: %d]', 'simple', opt.cleanIntervalInMills, opt.maxCount);
    logger_1.logger.debug('start to make barrier: %s', barrier.toString());
    const lastCleanTimeHolder = [new Date().getTime()];
    barrier.addTimer(setInterval(() => {
        barrier._counter.zero();
        logger_1.logger.debug('zero counter of barrier: %s', barrier.toString());
        lastCleanTimeHolder[0] = new Date().getTime();
    }, opt.cleanIntervalInMills));
    barrier._computeBlockTimeInMills = (counter) => {
        const passTime = new Date().getTime() - lastCleanTimeHolder[0];
        const remainTime = opt.cleanIntervalInMills - passTime;
        return Math.max(remainTime, 0);
    };
    barrier._isBlockFunc = (counter) => {
        return counter.getCount() >= opt.maxCount;
    };
    logger_1.logger.debug('end to make barrier: %s', barrier.toString());
    return barrier;
}
exports.makeBarrierInterval = makeBarrierInterval;
