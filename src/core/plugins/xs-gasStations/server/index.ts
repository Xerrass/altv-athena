import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { GasStationSystem } from './GasStationSystem';
import './GasStations/init'
import './GasStationFunctions'

const PLUGIN_NAME = 'xs-gasStations';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    GasStationSystem.init()
});
