import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_LTDGasoline } from '../GasStationOwners/ltd';

const GasStation = {
    displayName: "Rockford North Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(1181, -333, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(1177.5156, -331.499, 69.3165)
    ],
    owner: Owner_LTDGasoline
} as IGasStation

GasStationSystem.addGasStation(GasStation)