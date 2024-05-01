import * as alt from 'alt-shared'
import { GarageType } from '../enum/garageType'
import { SpotInfo } from './spotInfo'



export interface GarageInfo {
    id: number
    name: string

    permission: Array<string>
    garage_type: GarageType

    interaction_pos: alt.IVector3
    ped_rot: number

    parking_spots: Array<SpotInfo>

}