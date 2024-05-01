import * as alt from 'alt-shared'

export interface IElevator {
    name: string
    isCarElevator: boolean
    elevatorStops: Array<IElevatorStop>
    elevatorTeleportTime?: number
}

export interface IElevatorStop {
    name: string
    pos: alt.IVector3
    showmarker?: boolean
    rot?: alt.IVector3
    keyItemName?: string
    permission?: string

    /*
    * do not set this!
    */
    show?: boolean
}