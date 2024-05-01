import * as alt from 'alt-server'
import { IInterior } from './IInterior'


export interface IAppartment {
    _id?: unknown
    pos: alt.IVector3
    dimension: number
    highrise_id?: number
    address?: string
    owner?: number
    interior?: IInterior
    door_locked?: boolean
}