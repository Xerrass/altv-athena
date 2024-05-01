import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_RonOil } from '../GasStationOwners/ronOil';

const GasStation = {
    displayName: "Rockford Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(-1437, -276, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(-1444.0157, -273.9, 46.3937)
    ],
    owner: Owner_RonOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)