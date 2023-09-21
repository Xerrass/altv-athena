import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import './keys';
import { generateKeyItems } from './keys';
import { generateBlips } from './blips';
import { initHarvest } from './harvest';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState';



const PLUGIN_NAME = 'x-misc';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from Athena Server!');
    await Database.createCollection("doors");
    Athena.systems.defaults.weather.disable();
    Athena.systems.defaults.weaponItems.disable();
    Athena.systems.defaults.ammo.disable()
    Athena.systems.defaults.vehiclesDespawnOnLeave.disable()
    Athena.systems.defaults.vehiclesSpawnOnJoin.disable()
    Athena.systems.defaults.hospitalBlips.disable()

    generateKeyItems()
    generateBlips()
    initHarvest()
    spawnVehicles()

});


Athena.commands.register(
    "hub", "teleport to the hub", ['admin'], (player: alt.Player) => {
        Athena.player.teleport.toPosition(player, new alt.Vector3(-178, -158, 94))
    }
)

async function spawnVehicles() {
    const allDatabaseVehicles = await Database.fetchAllData<OwnedVehicle>(Athena.database.collections.Vehicles);
    let count = 0

    allDatabaseVehicles.forEach((vehicle) => {
        if (vehicle.garageInfo == null) {
            let spawnedVehicle = Athena.vehicle.spawn.persistent(vehicle);
            if (!Athena.vehicle.controls.isLocked(spawnedVehicle)) {
                Athena.vehicle.controls.toggleLock(spawnedVehicle)
            }
            count++
        }
    })
    alt.log(`Just spawned ${count} vehicles`)
}

Athena.commands.register("setColors", "pri, sec, pearl, customPri, customSec", ["admin"], async (player: alt.Player, pri, sec, pearl) => {
    let vehicle = Athena.utility.closest.getClosestVehicle(player.pos);

    vehicle.primaryColor = parseInt(pri);
    vehicle.secondaryColor = parseInt(sec);
    vehicle.pearlColor = parseInt(pearl);
    Athena.document.vehicle.set(vehicle, "state.primaryColor", parseInt(pri))
    Athena.document.vehicle.set(vehicle, "state.secondaryColor", parseInt(sec))
    Athena.document.vehicle.set(vehicle, "state.pearlColor", parseInt(pearl))


})