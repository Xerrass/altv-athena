import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { Owner_GlobeOil } from '../GasStationOwners/globeOil';
import { GasStationSystem } from '../GasStationSystem';

const GasStation = {
    displayName: "Paleto East Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(1705, 6416, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(1705.9569, 6415.0351, 32.764)
    ],
    owner: Owner_GlobeOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)