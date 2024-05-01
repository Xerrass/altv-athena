import * as alt from 'alt-shared'
import { IGasStationOwner } from './IGasStationOwner'
import { Blip } from '@AthenaShared/interfaces/blip'
import { FUEL_TYPE } from '../../../../shared/enums/vehicleTypeFlags'

export interface IGasStation {
    displayName: string
    owner: IGasStationOwner
    fuelSpots: Array<alt.IVector3>
    permission?: string
    blip?: Blip
    deliverySpot?: alt.IVector3
    aviableFuel?: Array<FUEL_TYPE>
}