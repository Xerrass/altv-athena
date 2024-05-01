import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '@AthenaPlugins/xs-gasStations/shared/interfaces/IGasStation';
import { GasStationSystem } from '../GasStationSystem';
import { Owner_xeroGAS } from '../GasStationOwners/xeroGas';

const GasStation = {
    displayName: "Rockford Strand Tankstelle",
    blip: { color: 53, pos: new alt.Vector3(-2097, -316, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
    fuelSpots: [
        new alt.Vector3(-2105.4958, -325.7647, 13.1686)
    ],
    owner: Owner_xeroGAS
} as IGasStation

GasStationSystem.addGasStation(GasStation)