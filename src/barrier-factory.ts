import { Barrier } from "./barrier";
import { format } from "util";
import { logger } from "./logger";

class BarrierIntervalOption {
    cleanIntervalInMills: number
    maxCount: number
}

function makeBarrierInterval(opt: BarrierIntervalOption) {
    if (opt.cleanIntervalInMills <= 0) {
        logger.warn('fail to makeBarrierInterval with reason: "%s"', 'opt.cleanIntervalInMills must not empty')
        return null
    }
    if (opt.maxCount <= 0) {
        logger.warn('fail to makeBarrierInterval with reason: "%s"', 'opt.maxCount must greater then 0')
        return null
    }

    const barrier = new Barrier()
    barrier._desc = format('[type: %s, cleanIntervalInMills: %d maxCount: %d]', 'simple', opt.cleanIntervalInMills, opt.maxCount)

    logger.debug('start to make barrier: %s', barrier.toString())

    const lastCleanTimeHolder = [new Date().getTime()]
    barrier.addTimer(setInterval(() => {
        barrier._counter.zero()
        logger.debug('zero counter of barrier: %s', barrier.toString())
        lastCleanTimeHolder[0] = new Date().getTime()
    }, opt.cleanIntervalInMills))

    barrier._computeBlockTimeInMills = (counter) => {
        const passTime = new Date().getTime() - lastCleanTimeHolder[0]
        const remainTime = opt.cleanIntervalInMills - passTime
        return Math.max(remainTime, 0)
    }

    barrier._isBlockFunc = (counter) => {
        return counter.getCount() >= opt.maxCount
    }

    logger.debug('end to make barrier: %s', barrier.toString())
    return barrier
}

export {
    makeBarrierInterval, BarrierIntervalOption,
}