import {
  SubstrateBatchProcessor,
  type BatchContext,
  type BatchProcessorCallItem,
  type BatchProcessorEventItem,
  type BatchProcessorItem,
} from '@subsquid/substrate-processor'
import {Store} from '@subsquid/typeorm-store'
import {lookupArchive} from '@subsquid/archive-registry'

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive('khala', { type: "Substrate" }),
  })
  .addEvent('PhalaStakePoolv2.PoolCreated', {
    data: { event: { args: true}},
  } as const)
  .addEvent('PhalaStakePoolv2.RewardReceived', {
    data: { event: { args: true}},
  } as const)

export type Item = BatchProcessorItem<typeof processor>
export type EventItem = BatchProcessorEventItem<typeof processor>
export type CallItem = BatchProcessorCallItem<typeof processor>
export type Ctx = BatchContext<Store, Item>
