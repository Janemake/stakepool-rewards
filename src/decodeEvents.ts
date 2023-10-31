import {SubstrateBlock} from '@subsquid/substrate-processor'
import {Ctx} from './processor'
import {
      PhalaStakePoolv2PoolCreatedEvent,
      PhalaStakePoolv2RewardReceivedEvent,


} from './types/events'
import {encodeAddress, toBalance} from './utils/converter'

class UknownVersionError extends Error {
  constructor() {
      super('Uknown verson')
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const decodeEvent = (
  ctx: Ctx,
  item: Ctx['blocks'][number]['items'][number]
) => {
  
  let name = item.name

   
  //console.log("Traitement de l'event  =====> ", name)

  switch (item.name) {


    case 'PhalaStakePoolv2.PoolCreated': {
      const e = new PhalaStakePoolv2PoolCreatedEvent(ctx, item.event)
      if (e.isV1199){
            const {owner, pid, cid, poolAccountId} = e.asV1199
          return {
            name,
            args: {
              pid: String(pid),
              owner: encodeAddress(owner),
              cid,
              poolAccountId: encodeAddress(poolAccountId),
            },
          }
      }

    }
 
    case 'PhalaStakePoolv2.RewardReceived': {
      const e = new PhalaStakePoolv2RewardReceivedEvent(ctx, item.event)
      if (e.isV1199){
            const {pid, toOwner, toStakers} = e.asV1199
          return {
            name,
            args: {
              pid: String(pid),
              toOwner: toBalance(toOwner),
              toStakers: toBalance(toStakers),
            },
          }
      }

    }


  }
}

const decodeEvents = (
  ctx: Ctx
): Array<
  Exclude<ReturnType<typeof decodeEvent>, undefined> & {
    block: SubstrateBlock
  }
> => {
  const decodedEvents = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      const decoded = decodeEvent(ctx, item)
      if (decoded != null) {
        decodedEvents.push({...decoded, block: block.header})
      }
    }
  }

  return decodedEvents
}
export default decodeEvents