import * as alt from 'alt-server'
import { APARTMENT_INTERIORS } from '../enums/APARTMENT_INTERIORS'


export interface IAppartment {
    _id?: unknown
    pos: alt.Vector3
    dimension: number
    interior: APARTMENT_INTERIORS
}