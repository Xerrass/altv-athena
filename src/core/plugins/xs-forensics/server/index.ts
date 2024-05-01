import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { XS_FORENSIC_EVENTS } from '../shared/events';
import { NotifyController } from '@AthenaPlugins/fnky-notifcations/server';


const PLUGIN_NAME = 'xs-forensics';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log("Hello from Forensics...")

});

