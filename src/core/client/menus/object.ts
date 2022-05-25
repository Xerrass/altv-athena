import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';
import { ClientPedController } from '../streamers/ped';

type ObjectMenuInjection = (modelHash: number, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<ObjectMenuInjection> = [];

export class ObjectWheelMenu {
    /**
     * Allows the current Menu Options to be modified.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {ObjectMenuInjection} callback
     * @memberof ObjectWheelMenu
     */
    static addInjection(callback: ObjectMenuInjection) {
        Injections.push(callback);
    }

    /**
     * Opens the wheel menu against a target npc script id.
     *
     * @static
     * @param {number} scriptID
     * @return {*}
     * @memberof ObjectWheelMenu
     */
    static openMenu(scriptID: number) {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!native.isEntityAnObject(scriptID)) {
            return;
        }

        const coords = native.getEntityCoords(scriptID, false);
        const dist = distance(alt.Player.local.pos, coords);
        if (dist >= 3) {
            return;
        }

        const hash = native.getEntityModel(scriptID);

        let options: Array<IWheelOptionExt> = [];

        for (const callback of Injections) {
            try {
                options = callback(hash, options);
            } catch (err) {
                console.warn(`Got Object Menu Injection Error: ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Object', options);
    }
}
