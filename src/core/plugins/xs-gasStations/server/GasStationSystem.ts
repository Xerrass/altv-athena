import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IGasStation } from '../shared/interfaces/IGasStation';
import { XS_GAS_STATION_EVENTS } from '../shared/enum/GasStationEvents';

let activeGasStations: Array<IGasStation> = []

export class GasStationSystem {
    static init() {
        alt.log("GasStation System Init")
    }

    static addGasStation(gasStation: IGasStation) {

        if (typeof gasStation.blip !== "undefined") {
            Athena.controllers.blip.append(gasStation.blip);
        }
        gasStation.fuelSpots.forEach((spot) => {
            Athena.controllers.interaction.append({
                position: { x: spot.x, y: spot.y, z: spot.z - 1 },
                callback(player, ...args) {
                    if (typeof gasStation.permission !== "undefined") {
                        if (!Athena.player.permission.hasPermission(player, gasStation.permission)) {
                            alt.log("no permission on this GasStation")
                            return
                        }
                    }
                    alt.emitClient(player, XS_GAS_STATION_EVENTS.VIEW_OPEN_GS, gasStation)
                },
            })
        })
    }
}