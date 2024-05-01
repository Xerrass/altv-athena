import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { XS_FORENSIC_EVENTS } from '../shared/events';
import Database from '@stuyk/ezmongodb';


class ForensicsSystem {
    static async init() {
        await Database.createCollection("housing");



    }

    static handlePlayerWeaponShot() {
        Athena.controllers.marker.append({

            color: new alt.RGBA(255, 255, 255),
            pos: new alt.Vector3(player.pos.x, player.pos.y, player.pos.z - 1),
            type: 25,
            scale: new alt.Vector3(0.2, 0.2, 0.2),
            maxDistance: 5
        })
    }
}


alt.onClient(XS_FORENSIC_EVENTS.WEAPON_SHOT, ForensicsSystem.handlePlayerWeaponShot)