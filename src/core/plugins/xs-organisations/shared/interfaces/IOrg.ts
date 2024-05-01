import { IBankAccount } from '@AthenaPlugins/xs-banking/shared/IBankAccount'
import * as alt from 'alt-shared'
import { IOrgRank } from './IOrgRank'
import { Blip } from '@AthenaShared/interfaces/blip'
import { IOrgStorage } from './IOrgStorage'

export interface IOrg {
    dbname: string
    displayName: string
    ranks: Array<IOrgRank>

    stampPoints?: Array<alt.IVector3>
    storages?: Array<IOrgStorage>
    blips?: Array<Blip>
}


