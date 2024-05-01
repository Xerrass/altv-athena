import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { init } from './garage';


const PLUGIN_NAME = 'x-garage';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from the Garage Plugin!');
    init()
});