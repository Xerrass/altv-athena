import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_RonOil } from '../GasStationOwners/ronOil';

const GasStation = {
    displayName: "East Highway Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(2580, 358, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(2574.0461, 359.2488, 108.6477)
    ],
    owner: Owner_RonOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)