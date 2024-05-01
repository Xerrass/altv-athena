import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_SandyGS } from '../GasStationOwners/SandyGS';

const GasStation = {
    displayName: "Sandy's Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(2009, 3776, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(2009.9387, 3776.2932, 32.4039)
    ],
    owner: Owner_SandyGS
} as IGasStation

GasStationSystem.addGasStation(GasStation)