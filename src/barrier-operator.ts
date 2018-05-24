import { format } from "util";
import { logger } from "./logger";
import { Barrier } from "./barrier";

function and(...barriers: Barrier[]) {
    barriers = barriers.filter(it => it != null)
    if (barriers == null || barriers.length == 0) {
        logger.warn('fail to makeBarrierAnd with reason: "%s"', 'opt.subBarriers must not empty')
        return null
    }

    const barrier = new Barrier()
    barriers.forEach(sub => barrier.addSubBarrier(sub))

    barrier._desc = format('[type: %s subBarrierCount: %d]', 'and', barrier._subBarriers.length)
    logger.debug('start to make barrier: %s', barrier.toString())

    barrier._isBlockFunc = (counter) => {
        for (const subBarrier of barrier._subBarriers) {
            if (subBarrier.isBlock()) {
                return true
            }
        }
        return false
    }

    barrier._computeBlockTimeInMills = (counter) => {
        return barrier
            ._subBarriers
            .filter(it => it.isBlock())
            .reduce((pv, cv) => {
                return Math.max(pv, cv.computeBlockTimeInMills())
            }, 0)
    }

    logger.debug('end to make barrier: %s', barrier.toString())

    return barrier
}

function or(...barriers: Barrier[]) {
    barriers = barriers.filter(it => it != null)
    if (barriers == null || barriers.length == 0) {
        logger.warn('fail to makeBarrierAnd with reason: "%s"', 'opt.subBarriers must not empty')
        return null
    }

    const barrier = new Barrier()

    barriers.forEach(sub => barrier.addSubBarrier(sub))

    barrier._desc = format('[type: %s subBarrierCount: %d]', 'or', barrier._subBarriers.length)
    logger.debug('start to make barrier: %s', barrier.toString())
    barrier._isBlockFunc = (counter) => {
        for (const subBarrier of barrier._subBarriers) {
            if (subBarrier.isBlock() == false) {
                return false
            }
        }
        return true
    }

    barrier._computeBlockTimeInMills = (counter) => {
        return barrier
            ._subBarriers
            .filter(it => it.isBlock())
            .reduce((pv, cv) => {
                return Math.max(pv, cv.computeBlockTimeInMills())
            }, 0)
    }

    logger.debug('end to make barrier: %s', barrier.toString())

    return barrier
}

export {
    and, or
}