import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import './commands'
import './functions'
import { ElevatorFunctions } from './functions';

const PLUGIN_NAME = 'xs-elevator';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    ElevatorFunctions.init()

});
