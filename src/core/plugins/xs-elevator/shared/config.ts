import * as alt from 'alt-shared'
import { IElevator } from './interfaces/IElevator'

export let elevators: Array<IElevator> = new Array<IElevator>


elevators.push({
    name: "Rockford Plaza",
    isCarElevator: false,
    elevatorStops: [
        {
            name: "Hub",
            pos: new alt.Vector3(-164.8, -153.8, 93.7),

        },
        {
            name: "Ground Level",
            pos: new alt.Vector3(-237.08, -256.26, 39.117),
            showmarker: false
        }
    ]
})
