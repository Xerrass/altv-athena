import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { elevators } from '../shared/config';
import { ELEVATOR_EVENTS } from '../shared/enum/events';

export class ElevatorFunctions {
    static init() {
        elevators.forEach((elevator) => {
            elevator.elevatorStops.forEach((stop) => {
                let _isPlayerOnly, _scale, _range
                if (elevator.isCarElevator) {
                    _isPlayerOnly = false;
                    _scale = new alt.Vector3(3, 3, 0)
                    _range = 3
                } else {
                    _isPlayerOnly = true
                    _scale = new alt.Vector3(1, 1, 0)
                    _range = 1
                }
                Athena.controllers.interaction.append({
                    position: { x: stop.pos.x, y: stop.pos.y, z: stop.pos.z - 1 },
                    isPlayerOnly: _isPlayerOnly,
                    range: _range,
                    async callback(player) {
                        for (let _stop of elevator.elevatorStops) {
                            if (_stop.keyItemName) {
                                if (await Athena.player.inventory.has(player, _stop.keyItemName, 1)) {
                                    _stop.show = true
                                } else {
                                    _stop.show = false
                                }
                            } else if (_stop.permission) {
                                if (Athena.player.permission.hasPermission(player, _stop.permission) || Athena.player.permission.hasAccountPermission(player, _stop.permission)) {
                                    _stop.show = true
                                } else {
                                    _stop.show = false
                                }
                            } else {
                                _stop.show = true
                            }
                            if (_stop.name === stop.name) {
                                _stop.show = false
                            }
                            if (Athena.player.permission.hasAccountPermission(player, 'debug')) {
                                _stop.show = true
                            }

                        }
                        alt.emitClient(player, ELEVATOR_EVENTS.VIEW_OPEN, elevator)
                    },
                })
                let showmarker = typeof stop.showmarker !== "undefined" ? stop.showmarker : (stop.showmarker = true)
                if (showmarker) {
                    Athena.controllers.marker.append({
                        color: new alt.RGBA(0, 113, 255),
                        pos: { x: stop.pos.x, y: stop.pos.y, z: stop.pos.z - 0.98 },
                        type: 25,
                        scale: _scale
                    })
                }
            })
        })
    }

    static teleport(player: alt.Player, targetCords: alt.IVector3, targetRot: alt.Vector3 = new alt.Vector3(0, 0, 0)) {
        Athena.player.emit.fadeScreenToBlack(player, 1000)
        alt.setTimeout(() => {
            Athena.player.safe.setPosition(player, targetCords.x, targetCords.y, targetCords.z)
            player.rot = targetRot
            alt.setTimeout(() => {
                Athena.player.emit.fadeScreenFromBlack(player, 500)
            }, 100)
        }, 1100)
        //Athena.player.safe.set
    }
}
alt.onClient(ELEVATOR_EVENTS.TELEPORT, ElevatorFunctions.teleport)