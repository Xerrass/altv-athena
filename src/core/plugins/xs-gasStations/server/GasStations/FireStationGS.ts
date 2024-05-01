import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_RonOil } from '../GasStationOwners/ronOil';
import { FUEL_TYPE } from '@AthenaShared/enums/vehicleTypeFlags';

export const FireStationGS = {
    displayName: "EastSide Firestation Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(1208, -1403, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(1209.679, -1406.459, 35.385)
    ],
    owner: Owner_RonOil,
    aviableFuel: [FUEL_TYPE.DIESEL, FUEL_TYPE.GAS, FUEL_TYPE.ELECTRIC]

} as IGasStation

GasStationSystem.addGasStation(FireStationGS)