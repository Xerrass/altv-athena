import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { Owner_GlobeOil } from '../GasStationOwners/globeOil';
import { GasStationSystem } from '../GasStationSystem';

const GasStation = {
    displayName: "VineWood Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(619, 271, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(613, 274, 103.277)
    ],
    owner: Owner_GlobeOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)