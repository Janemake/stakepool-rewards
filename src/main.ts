import {TypeormDatabase} from '@subsquid/typeorm-store'
import {In} from 'typeorm'
import decodeEvents from './decodeEvents'
import {
  Account,
  StakePool,
} from './model'
import {processor} from './processor'
import {getAccount, getStakePool} from './utils/common'


processor.run(new TypeormDatabase(), async (ctx) => {
  const events = decodeEvents(ctx)

  const stakePoolIdSet = new Set<string>()
  // const rewardEventIdSet = new Set<string>()
  const accountIds = new Set<string>()

  for (const {name, args} of events) {
    if (name === 'PhalaStakePoolv2.PoolCreated') {
      stakePoolIdSet.add(String(args.pid))
      accountIds.add(String(args.owner))
    }  

    if (name === 'PhalaStakePoolv2.RewardReceived') {
        // console.log("name: ===>", name)
        // rewardEventIdSet.add(String(args.pid))
        stakePoolIdSet.add(String(args.pid))
    }  
  }
  
  let accountMap = await ctx.store.findBy(Account, {id: In([...accountIds])})
                                  .then(accountMap => {
                                          return new Map(accountMap.map(a => [String(a.id), a]))
                                          }
  )

  let stakePoolMap = await ctx.store.findBy(StakePool, {id: In([...stakePoolIdSet])})
                                    .then(stakePoolMap => {
                                          return new Map(stakePoolMap.map(a => [String(a.id), a]))
                                          }
  )    
  // console.log(":::: Pool:",stakePoolMap)                                         
  for (const {name, args, block} of events) {

    switch (name) {
      
      case 'PhalaStakePoolv2.PoolCreated': {
          
          const {pid, owner, cid, poolAccountId} = args
          
          // if (String(pid) == "3276"){
            // console.log(":::: Pool:",pid, ":::: Owner:", String(owner), " created")  
          // } 
          const accountId = getAccount(accountMap, String(owner))
          const stakePoolId = getStakePool(stakePoolMap, String(pid))
       
          stakePoolId.owner = accountId


          await ctx.store.save(accountId)
          await ctx.store.insert(stakePoolId)
          break
      }
      
      case 'PhalaStakePoolv2.RewardReceived': {
          const {pid, toOwner, toStakers} = args
          const stakePool = getStakePool(stakePoolMap, pid)
          
          if (toOwner != undefined) {
            stakePool.ownerRewards = stakePool.ownerRewards
                                              .plus(toOwner)
            stakePool.totalRewards= stakePool.totalRewards
                                              .plus(toOwner)                                                      
          } 

          if (toStakers != undefined) {
            stakePool.delegatorRewards = stakePool.delegatorRewards.plus(toStakers)
            stakePool.totalRewards= stakePool.totalRewards.plus(toStakers)
          } 

          // if (String(pid) == "3276"){
          //   console.log(":::: Pool:",pid, ":::: Owner Rewards:", String(toOwner), ":::: Delegators Rewards:", String(toStakers))  
          //   console.log(":::: Pool:",pid, ":::: Total Rewards:", String(stakePool.totalRewards))  
          // }
          //stakePoolMap.set(String(pid), stakePool)
          await ctx.store.save(stakePool)
          break
      }
      
    }
  }
  
  for (const x of [
    accountMap,
    stakePoolMap,

  ]) {
    if (x instanceof Map) {
      await ctx.store.save([...x.values()])
    } else if (Array.isArray(x)) {
      // Bypass type check
      await ctx.store.save(x)
    } else {
      await ctx.store.save(x)
    }
  }


})