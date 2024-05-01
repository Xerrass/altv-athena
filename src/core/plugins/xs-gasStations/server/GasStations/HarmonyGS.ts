import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { Owner_GlobeOil } from '../GasStationOwners/globeOil';
import { GasStationSystem } from '../GasStationSystem';

const GasStation = {
    displayName: "Paleto East Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(261, 2604, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(263.0018, 2607.3149, 44.9858),
        new alt.Vector3(265.1454, 2606.686, 44.9858)
    ],
    owner: Owner_GlobeOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)