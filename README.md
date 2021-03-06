# NodeBarrier

## Intro

Barrier to block you operation

## Author

> gintama.zheng@gmail.com

## Latest Version

> 0.5.0

## How To Install

```shell
yarn add node-barrier@0.5.0
```

## Dependencies

- @log4js-node/log4js-api"

## Test Dependencies

- @types/chai
- @types/mocha
- @types/node
- chai
- log4js
- mocha

## Usage

Example for BarrierInterval

```javascript
const { Barrier, BarrierFactory, BarrierOperator } = require('node-barrier')

// create barrier to block operation count to 10 per second
const barrier = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 10
        })

await BarrierOperator.wait(barrier)
barrier.increaseCounter()
// perform you operation

```

Example for BarrierAnd

```javascript
const { Barrier, BarrierFactory, BarrierOperator } = require('node-barrier')

// create barrier to block operation count to 10 per second
const barrier1 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 10
        })
const barrier2 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 2000,
            maxCount: 10
        })
const barrier = BarrierOperator.and(barrier1, barrier2)

const blockTime = barrier.computeBlockTimeInMills()
await BarrierOperator.wait(barrier)
barrier.increaseCounter()
// perform you operation

```

Example for BarrierOr

```javascript
const { Barrier, BarrierFactory, BarrierOperator } = require('node-barrier')

// create barrier to block operation count to 10 per second
const barrier1 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 1000,
            maxCount: 10
        })
const barrier2 = BarrierFactory.makeBarrierInterval({
            cleanIntervalInMills: 2000,
            maxCount: 10
        })
const barrier = BarrierOperator.or(barrier1, barrier2)

await BarrierOperator.wait(barrier)
barrier.increaseCounter()
// perform you operation

```