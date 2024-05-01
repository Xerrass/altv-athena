import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { GARAGES } from '../shared/config';
import { GarageType } from '../shared/enum/garageType';
import { GarageInfo } from '../shared/interfaces/garageInfo';
import { NotifyController } from '@AthenaPlugins/fnky-notifcations/server';
import { GARAGE_INTERACTIONS } from '../shared/enum/garageInteractions';

export function init() {

    GARAGES.forEach((garage: GarageInfo) => {

        let blipSprite = getGarageSprite(garage.garage_type)

        generateBlip({
            pos: garage.interaction_pos,
            color: 22,
            scale: 1,
            sprite: blipSprite,
            text: garage.name
        })

        Athena.controllers.staticPed.append({

            model: "S_M_Y_AirWorker",
            pos: { x: garage.interaction_pos.x, y: garage.interaction_pos.y, z: garage.interaction_pos.z - 1 },
            heading: garage.ped_rot
        })
        Athena.controllers.interaction.append({
            position: { x: garage.interaction_pos.x, y: garage.interaction_pos.y, z: garage.interaction_pos.z - 1 },
            isPlayerOnly: true,
            callback(player, ...args) {
                alt.emitClient(player, GARAGE_INTERACTIONS.OPEN, Athena.vehicle.get.ownedVehiclesByPlayer(player))
            },
        })

    })
}


function spawnVehicle(player: alt.Player, garage: GarageInfo) {
    let vehicleSpawned = false;
    garage.parking_spots.forEach((spot) => {
        let closestVehicle: alt.Vehicle = Athena.utility.closest.getClosestVehicle(spot.pos)
        if (Athena.utility.vector.distance(spot.pos, closestVehicle.pos) >= 5 && !vehicleSpawned) {
            new alt.Vehicle("adder", spot.pos, spot.rot)
            vehicleSpawned = true
        }
    })

    NotifyController.send(player, 3, 5, 'Fehler', `Es ist kein Spot frei!`);
}


function getGarageSprite(garage_type: GarageType) {
    let blipSprite;
    switch (garage_type) {
        case GarageType.CAR: {
            blipSprite = 524;
            break;
        }
        case GarageType.BOAT: {
            blipSprite = 524;
            break;
        }
        case GarageType.HELICOPTER: {
            blipSprite = 360;
            break;
        }
        case GarageType.PLANE: {
            blipSprite = 557;
            break;
        }
        case GarageType.TRUCK: {
            blipSprite = 473;
            break;
        }
    }
    return blipSprite
}


interface Blip_Data {
    color: alt.BlipColor
    pos: alt.IVector3
    scale: number
    shortRange?: boolean
    text: string
    sprite: alt.BlipSprite
}

function generateBlip(blip: Blip_Data) {
    let shortRange = true;

    shortRange = blip.shortRange ? shortRange : true;
    Athena.controllers.blip.append({
        color: blip.color,
        pos: blip.pos,
        scale: blip.scale,
        shortRange: shortRange,
        text: blip.text,
        sprite: blip.sprite
    })
}