import * as alt from 'alt-shared'
import { IOrgRank } from './IOrgRank'
import { ORG_STORAGE_TYPES } from '../enum/OrgStorageTypes'

export interface IOrgStorage {
    pos: alt.IVector3
    name: string
    permissions: Array<IOrgRank>
    storageType: ORG_STORAGE_TYPES
}