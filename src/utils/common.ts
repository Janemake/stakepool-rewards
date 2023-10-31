import {BigDecimal} from '@subsquid/big-decimal'
import {Account, StakePool} from '../model'

export const getAccount = (m: Map<string, Account>, id: string): Account => {
  let acc = m.get(String(id))
  if (acc == null) {
    acc = new Account({
      id,
    })
    m.set(String(id), acc)
  }
  return acc
}

export const getStakePool = (m: Map<string, StakePool>, id: string): StakePool => {
  let poolId = m.get(String(id))
  if (poolId == null) {
    if (String(id) == "3276"){
      console.log(":::: Pool recreated:",id, )
    }
      poolId = new StakePool({
              id: String(id),
              ownerRewards: BigDecimal(0),
              delegatorRewards: BigDecimal(0),
              totalRewards: BigDecimal(0),
    })
    m.set(String(id), poolId)
    // console.log(":::: Pool Group:",m)  
  }
  return poolId
 }


export const join = (...args: Array<string | number | bigint>): string =>
  args.map((x) => x.toString()).join('-')

export const toMap = <T extends {id: string}>(
  a: T[],
  fn: (a: T) => string = (a) => a.id
): Map<string, T> => new Map(a.map((a) => [fn(a), a]))

export const max = (a: BigDecimal, b: BigDecimal): BigDecimal =>
  a.gt(b) ? a : b

export const min = (a: BigDecimal, b: BigDecimal): BigDecimal =>
  a.lt(b) ? a : b

export const sum = (...args: BigDecimal[]): BigDecimal =>
  args.reduce((a, b) => a.plus(b), BigDecimal(0))
