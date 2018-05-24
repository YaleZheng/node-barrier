"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const logger_1 = require("./logger");
const barrier_1 = require("./barrier");
function and(...barriers) {
    barriers = barriers.filter(it => it != null);
    if (barriers == null || barriers.length == 0) {
        logger_1.logger.warn('fail to makeBarrierAnd with reason: "%s"', 'opt.subBarriers must not empty');
        return null;
    }
    const barrier = new barrier_1.Barrier();
    barriers.forEach(sub => barrier.addSubBarrier(sub));
    barrier._desc = util_1.format('[type: %s subBarrierCount: %d]', 'and', barrier._subBarriers.length);
    logger_1.logger.debug('start to make barrier: %s', barrier.toString());
    barrier._isBlockFunc = (counter) => {
        for (const subBarrier of barrier._subBarriers) {
            if (subBarrier.isBlock()) {
                return true;
            }
        }
        return false;
    };
    barrier._computeBlockTimeInMills = (counter) => {
        return barrier
            ._subBarriers
            .filter(it => it.isBlock())
            .reduce((pv, cv) => {
            return Math.max(pv, cv.computeBlockTimeInMills());
        }, 0);
    };
    logger_1.logger.debug('end to make barrier: %s', barrier.toString());
    return barrier;
}
exports.and = and;
function or(...barriers) {
    barriers = barriers.filter(it => it != null);
    if (barriers == null || barriers.length == 0) {
        logger_1.logger.warn('fail to makeBarrierAnd with reason: "%s"', 'opt.subBarriers must not empty');
        return null;
    }
    const barrier = new barrier_1.Barrier();
    barriers.forEach(sub => barrier.addSubBarrier(sub));
    barrier._desc = util_1.format('[type: %s subBarrierCount: %d]', 'or', barrier._subBarriers.length);
    logger_1.logger.debug('start to make barrier: %s', barrier.toString());
    barrier._isBlockFunc = (counter) => {
        for (const subBarrier of barrier._subBarriers) {
            if (subBarrier.isBlock() == false) {
                return false;
            }
        }
        return true;
    };
    barrier._computeBlockTimeInMills = (counter) => {
        return barrier
            ._subBarriers
            .filter(it => it.isBlock())
            .reduce((pv, cv) => {
            return Math.max(pv, cv.computeBlockTimeInMills());
        }, 0);
    };
    logger_1.logger.debug('end to make barrier: %s', barrier.toString());
    return barrier;
}
exports.or = or;
