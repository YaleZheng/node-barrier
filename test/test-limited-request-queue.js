const log4js = require('log4js')
const { expect } = require('chai')
const { Barrier, BarrierFactory, BarrierOperator } = require('../dist/index')


log4js.configure({
    appenders: {
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        }
    }
})

function sleepAsync(timeInMills) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeInMills);
    })
}

describe('barrier-factory', () => {
    const logger = log4js.getLogger()

    /** @type {Barrier} */
    let aliveBarrier = null

    afterEach(() => {
        if (aliveBarrier != null) {
            aliveBarrier.release()
            aliveBarrier = null
        }
    })

    it('should fail to create barrierInterval', async () => {
        aliveBarrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 0,
            maxCount: 10
        })
        expect(aliveBarrier).to.be.null

        aliveBarrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 10,
            maxCount: 0
        })
        expect(aliveBarrier).to.be.null

        aliveBarrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 0,
            maxCount: 0
        })
        expect(aliveBarrier).to.be.null
    })

    it('should success to block with barrierInterval', async () => {
        aliveBarrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 100
        })
        for (let i = 0; i < 100; i++) {
            expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
            expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
            aliveBarrier.increaseCounter()
        }

        expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').gt(0).and.lte(1000)
    })
})

describe('barrier-operator', () => {
    const logger = log4js.getLogger()

    /** @type {Barrier} */
    let aliveBarrier = null

    afterEach(() => {
        if (aliveBarrier != null) {
            aliveBarrier.release()
            aliveBarrier = null
        }
    })

    it('should fail to create barrier with and', async () => {
        aliveBarrier = BarrierOperator.and(null)
        expect(aliveBarrier).to.be.null

        aliveBarrier = BarrierOperator.and(...[])
        expect(aliveBarrier).to.be.null
    })

    it('should fail to create with or', async () => {
        aliveBarrier = BarrierOperator.or(null)
        expect(aliveBarrier).to.be.null

        aliveBarrier = BarrierOperator.or(...[])
        expect(aliveBarrier).to.be.null
    })

    it('should success to wait', async () => {
        aliveBarrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 3000,
            maxCount: 1
        })
        expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').to.eq(0)

        aliveBarrier.increaseCounter()

        expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').to.gt(0).and.lte(3000)

        await BarrierOperator.wait(aliveBarrier)
        expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').to.eq(0)
    })

    it('should success to block with and', async () => {
        const subBarrier1 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 10
        })
        const subBarrier2 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 2000,
            maxCount: 25
        })
        aliveBarrier = BarrierOperator.and(subBarrier1, subBarrier2)

        for (let i = 0; i < 10; i++) {
            expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
            expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
            aliveBarrier.increaseCounter()
        }

        for (let i = 0; i < 15; i++) {
            expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
            expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').gt(0).and.lte(1000)
            aliveBarrier.increaseCounter()
        }

        expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').gt(1000).and.lte(2000)

        await sleepAsync(1000)
        expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').gt(0).and.lte(1000)

        await sleepAsync(1000)
        expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
    })

    it('should success to block with or', async () => {
        const subBarrier1 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 10
        })
        const subBarrier2 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 2000,
            maxCount: 25
        })
        aliveBarrier = BarrierOperator.or(subBarrier1, subBarrier2)

        for (let i = 0; i < 10; i++) {
            expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
            expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
            aliveBarrier.increaseCounter()
        }

        for (let i = 0; i < 15; i++) {
            expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
            expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
            aliveBarrier.increaseCounter()
        }

        expect(aliveBarrier.isBlock(), 'isBlock').to.be.true
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').gt(1000).and.lte(2000)

        await sleepAsync(1000)
        expect(aliveBarrier.isBlock(), 'isBlock').to.be.false
        expect(aliveBarrier.computeBlockTimeInMills(), 'blockTime').eq(0)
    })
})