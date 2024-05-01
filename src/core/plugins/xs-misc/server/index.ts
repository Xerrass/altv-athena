import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import './keys';
import { generateKeyItems } from './keys';
import { initHarvest } from './harvest';



const PLUGIN_NAME = 'x-misc';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from Athena Server!');
    await Database.createCollection("doors");
    Athena.systems.defaults.weather.disable();
    Athena.systems.defaults.weaponItems.disable();
    Athena.systems.defaults.ammo.disable()
    Athena.systems.defaults.hospitalBlips.disable()

    generateKeyItems()
    initHarvest()


});


Athena.commands.register(
    "hub", "teleport to the hub", ['admin'], (player: alt.Player) => {
        Athena.player.teleport.toPosition(player, new alt.Vector3(-178, -158, 94))
    }
)

Athena.commands.register(
    "v3", "pastes a vector3 to server Console", ['admin'], (player: alt.Player) => {
        alt.log(`${player.pos.x}, ${player.pos.y}, ${player.pos.z}`)
    }
)


