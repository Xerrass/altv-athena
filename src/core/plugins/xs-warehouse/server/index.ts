import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import * as Warehouse from './Warehouse'

const PLUGIN_NAME = 'x-warehouse';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    //console.log(Database)
    alt.log('Hello from Athena Server!');
    //await Database.createCollection("housing");
    Warehouse.init()

});

