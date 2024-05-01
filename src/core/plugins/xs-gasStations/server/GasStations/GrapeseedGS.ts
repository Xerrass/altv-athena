import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_LTDGasoline } from '../GasStationOwners/ltd';

const GasStation = {
    displayName: "Grapeseed Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(1689, 4932, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(1685.248, 4931.2705, 42.2316)
    ],
    owner: Owner_LTDGasoline
} as IGasStation

GasStationSystem.addGasStation(GasStation)