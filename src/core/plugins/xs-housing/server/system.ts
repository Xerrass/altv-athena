import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { IAppartment } from '../shared/interfaces/IAppartment';
import { appartment_interiors } from '../shared/config/interiors';
import { HOUSING_INTERACTIONS } from '../shared/enums/events';

var active_apartments: Array<IAppartment> = new Array<IAppartment>;


export class HousingFunctions {


    static async init() {
        await Database.createCollection("housing");
        const housing: Array<IAppartment> = await Database.fetchAllData<IAppartment>("housing")
        housing.forEach((appartment) => {
            this.createOutsideInteraction(appartment)
            this.createInsideInteraction(appartment)
            Athena.controllers.marker.append({
                color: new alt.RGBA(0, 255, 0),
                pos: appartment.pos,
                type: 25
            })
        })
    }


    static enter(player: alt.Player, appartment: IAppartment) {
        //alt.log(`${player.id} entering IPL! requesting ipl ${interiors[appartment.interior].ipl}`)
        if (appartment.interior.iplHash != "") {
            alt.emitClient(player, "requestIPL", appartment.interior.iplHash)
        }
        Athena.player.emit.fadeScreenToBlack(player, 1000)
        alt.setTimeout(() => {
            let pos = appartment.interior.interior_pos
            Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z)
            Athena.player.safe.setDimension(player, appartment.dimension)
            Athena.document.character.set(player, 'dimension', appartment.dimension);
            Athena.document.character.set(player, 'interior', appartment.interior.iplHash)
            alt.setTimeout(() => {
                Athena.player.emit.fadeScreenFromBlack(player, 500)
            }, 200)
        }, 1000)
    }


    static exit(player: alt.Player, appartment: IAppartment) {
        alt.log(`${player.name} exiting interior! ${appartment.interior}`)
        let pos = appartment.pos
        Athena.player.emit.fadeScreenToBlack(player, 1000)
        alt.setTimeout(() => {
            Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z)
            Athena.player.safe.setDimension(player, 0)
            Athena.document.character.set(player, 'dimension', 0);
            Athena.document.character.set(player, "interior", null)
            alt.setTimeout(() => {
                Athena.player.emit.fadeScreenFromBlack(player, 500)
            }, 200)
        }, 1000)
        if (appartment.interior.iplHash != "") {
            alt.setTimeout(() => {
                alt.emitClient(player, "removeIPL", appartment.interior.iplHash)
            }, 1000)
        }
    }


    static createOutsideInteraction(appartment: IAppartment) {
        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: appartment.pos,
            async callback(player: alt.Player) {
                alt.emitClient(player, HOUSING_INTERACTIONS.VIEW_OPEN, appartment)
            }
        })
    }


    static createInsideInteraction(appartment: IAppartment) {
        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: appartment.interior.interior_pos,
            dimension: appartment.dimension,
            async callback(player: alt.Player) {
                HousingFunctions.exit(player, appartment)
            }
        })
    }


}



alt.onClient(HOUSING_INTERACTIONS.ENTER, HousingFunctions.enter)



