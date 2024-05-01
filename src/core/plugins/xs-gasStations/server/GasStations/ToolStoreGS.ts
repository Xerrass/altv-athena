import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { Owner_GlobeOil } from '../GasStationOwners/globeOil';
import { GasStationSystem } from '../GasStationSystem';

const GasStation = {
    displayName: "VineWood Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(2677, 3261, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(2677.95166015625, 3262.720947265625, 55.3970947265625)
    ],
    owner: Owner_GlobeOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)