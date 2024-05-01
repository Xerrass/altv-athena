import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_RonOil } from '../GasStationOwners/ronOil';

const GasStation = {
    displayName: "Rout68 WestHighway Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(-2552, 2335, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(-2552.6156, 2335.0517, 33.2569)
    ],
    owner: Owner_RonOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)