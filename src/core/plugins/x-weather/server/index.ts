import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Weather from "./weather.js";

const PLUGIN_NAME = 'x-Weather';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    const weatherSync = new Weather("0d78d89a697dc18ed74bc6eee1eaee1a", "San Francisco", "US");
})




