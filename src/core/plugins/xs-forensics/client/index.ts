import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import { XS_FORENSIC_EVENTS } from '../shared/events';
import { sendNotification } from '@AthenaPlugins/fnky-notifcations/client';

function handlePlayerWeaponShot(weaponHash: number, totalAmmo: number, ammoInClip: number) {
    alt.emitServer(XS_FORENSIC_EVENTS.WEAPON_SHOT, weaponHash)


}

alt.on("playerWeaponShoot", handlePlayerWeaponShot)