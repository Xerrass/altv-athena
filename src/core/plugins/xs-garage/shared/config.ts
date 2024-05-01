import * as alt from 'alt-shared'
import { GarageInfo } from './interfaces/garageInfo'
import { GarageType } from './enum/garageType'




export const GARAGES: Array<GarageInfo> = [
    {
        id: 0,
        name: "Hub",
        garage_type: GarageType.CAR,
        permission: [],
        interaction_pos: new alt.Vector3(-192.2937, -176.8611, 43.6293),
        ped_rot: -60,
        parking_spots: [{
            pos: new alt.Vector3(-187.4, -176.6, 43.63),
            rot: new alt.Vector3(0, 0, -0.3345)
        },
        {
            pos: new alt.Vector3(-181.1, -178.75, 43.63),
            rot: new alt.Vector3(0, 0, -0.3345)
        },
        {
            pos: new alt.Vector3(-174.5, -181, 43.63),
            rot: new alt.Vector3(0, 0, -0.3345)
        }]
    }
]