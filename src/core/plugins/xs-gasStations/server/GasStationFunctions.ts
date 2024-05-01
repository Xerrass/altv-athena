import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { XS_GAS_STATION_EVENTS } from '../shared/enum/GasStationEvents';

export class GasStationFunctions {
    static fuelVehicle(player: alt.Player) {

        let vehicle = Athena.utility.closest.getClosestVehicle(player.pos)

        if (Athena.utility.vector.distance(player.pos, vehicle.pos) <= 5) {
            let currentFuel = Athena.document.vehicle.getField(vehicle, "fuel")
            alt.emitClient(player, XS_GAS_STATION_EVENTS.REFUEL_VEHICLE, vehicle, currentFuel)
        }
    }
    static setVehicleFuel(player: alt.Player, vehicle: alt.Vehicle, fuelLevel: number) {
        Athena.document.vehicle.set(vehicle, "fuel", fuelLevel)
    }
}

alt.onClient(XS_GAS_STATION_EVENTS.VEHICLE_SETFUEL, GasStationFunctions.setVehicleFuel)