import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class PhalaStakePoolv2PoolCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'PhalaStakePoolv2.PoolCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A stake pool is created by `owner`
     * 
     * Affected states:
     * - a new entry in [`Pools`] with the pid
     */
    get isV1199(): boolean {
        return this._chain.getEventHash('PhalaStakePoolv2.PoolCreated') === '720a4e6563b16af792d1a1fbbaddf69e57bccbbacc67267e9bbf437a48598f92'
    }

    /**
     * A stake pool is created by `owner`
     * 
     * Affected states:
     * - a new entry in [`Pools`] with the pid
     */
    get asV1199(): {owner: Uint8Array, pid: bigint, cid: number, poolAccountId: Uint8Array} {
        assert(this.isV1199)
        return this._chain.decodeEvent(this.event)
    }
}

export class PhalaStakePoolv2RewardReceivedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'PhalaStakePoolv2.RewardReceived')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * The amount of reward that distributed to owner and stakers
     */
    get isV1199(): boolean {
        return this._chain.getEventHash('PhalaStakePoolv2.RewardReceived') === 'ae6b7d16510f97a08b26da4e220f708f64330be952422280b4486922498b1e73'
    }

    /**
     * The amount of reward that distributed to owner and stakers
     */
    get asV1199(): {pid: bigint, toOwner: bigint, toStakers: bigint} {
        assert(this.isV1199)
        return this._chain.decodeEvent(this.event)
    }
}
