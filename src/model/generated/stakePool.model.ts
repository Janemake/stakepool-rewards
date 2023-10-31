import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class StakePool {
    constructor(props?: Partial<StakePool>) {
        Object.assign(this, props)
    }

    /**
     * pid
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    ownerRewards!: BigDecimal

    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    delegatorRewards!: BigDecimal

    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    totalRewards!: BigDecimal
}
