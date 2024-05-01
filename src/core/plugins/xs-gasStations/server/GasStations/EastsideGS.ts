import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_RonOil } from '../GasStationOwners/ronOil';

const GasStation = {
    displayName: "East Highway Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(818, -1025, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(818.4000244140625, -1026.22412109375, 26.3985595703125)
    ],
    owner: Owner_RonOil
} as IGasStation

GasStationSystem.addGasStation(GasStation)