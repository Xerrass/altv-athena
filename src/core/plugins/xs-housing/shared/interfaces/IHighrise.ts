import * as alt from 'alt-server'
import { IInterior } from './IInterior'
import { IAppartment } from './IAppartment'


export interface IHighrise {
    _id?: unknown
    pos: alt.IVector3
    address?: string
    appartments: Array<IAppartment>
}