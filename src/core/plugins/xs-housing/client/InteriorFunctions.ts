import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import { IInterior } from '../shared/interfaces/IInterior';
import { sendNotification } from '@AthenaPlugins/fnky-notifcations/client';


export class InteriorFunctions {

    static requestIPL(iplHash: string) {
        alt.requestIpl(iplHash)
    }

    static removeIPL(iplHash: string) {
        alt.removeIpl(iplHash)
    }



    static requestInterior(interior_data: IInterior) {
        if (typeof interior_data.iplHash === "string") {
            alt.requestIpl(interior_data.iplHash)
        } else {
            interior_data.iplHash.forEach((iplHash) => {
                alt.requestIpl(iplHash)
            })
        }
        alt.logDebug(`${interior_data.iplHash} requested`);

        if (interior_data.interior_props) {
            let interior = native.getInteriorAtCoords(interior_data.interior_pos.x, interior_data.interior_pos.y, interior_data.interior_pos.z)
            interior_data.interior_props.forEach((prop) => {
                native.activateInteriorEntitySet(interior, prop.propHash)
                if (prop.propColor) {
                    native.setInteriorEntitySetTintIndex(interior, prop.propHash, prop.propColor)
                }

            })
            native.refreshInterior(interior)
        }

    }
    static removeInterior(interior_data: IInterior) {
        if (typeof interior_data.iplHash === "string") {
            alt.removeIpl(interior_data.iplHash)
        } else {
            interior_data.iplHash.forEach((iplHash) => {
                alt.removeIpl(iplHash)
            })
        }
        alt.logDebug(`${interior_data.iplHash} removed`);
        if (interior_data.interior_props) {
            let interior = native.getInteriorAtCoords(interior_data.interior_pos.x, interior_data.interior_pos.y, interior_data.interior_pos.z)
            interior_data.interior_props.forEach((prop) => {
                native.deactivateInteriorEntitySet(interior, prop.propHash)
            })
            native.refreshInterior(interior)
        }


    }
}