import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_LTDGasoline } from '../GasStationOwners/ltd';

const GasStation = {
    displayName: "SouthSide Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(-71, -1765, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(-71.502, -1765.361, 29.5339)
    ],
    owner: Owner_LTDGasoline
} as IGasStation

GasStationSystem.addGasStation(GasStation)