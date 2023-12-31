import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {StakePool} from "./stakePool.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * account address
     */
    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => StakePool, e => e.owner)
    poolOwner!: StakePool[]
}
