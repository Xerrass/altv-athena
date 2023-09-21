import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { IAppartment } from './interfaces/IAppartment';
import { appartment_interiors } from './config/appartment_interiors';

const PLUGIN_NAME = 'x-housing';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from Athena Server!');
    await Database.createCollection("housing");
    const housing = await Database.fetchAllData<IAppartment>("housing")
    createMarkers(housing);

});



function createMarkers(housing: Array<IAppartment>) {
    housing.forEach((appartment) => {
        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: {
                x: appartment.pos.x,
                y: appartment.pos.y,
                z: appartment.pos.z - 0.98
            },
            description: "Haus Betreten " + appartment_interiors[appartment.interior].ipl,
            async callback(player: alt.Player) {
                //alt.log(`${player.id} entering IPL! requesting ipl ${interiors[appartment.interior].ipl}`)
                if (appartment_interiors[appartment.interior].ipl != "") {
                    alt.emitClient(player, "requestIPL", appartment_interiors[appartment.interior].ipl)
                }
                Athena.player.emit.fadeScreenToBlack(player, 1000)
                alt.setTimeout(() => {
                    let pos = appartment_interiors[appartment.interior].exit
                    Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z)
                    Athena.player.safe.setDimension(player, appartment.dimension)
                    Athena.document.character.set(player, 'dimension', appartment.dimension);
                    Athena.document.character.set(player, 'interior', appartment_interiors[appartment.interior].ipl)
                    alt.setTimeout(() => {
                        Athena.player.emit.fadeScreenFromBlack(player, 500)
                    }, 200)
                }, 1000)

            }
        })
        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: {
                x: appartment_interiors[appartment.interior].exit.x,
                y: appartment_interiors[appartment.interior].exit.y,
                z: appartment_interiors[appartment.interior].exit.z - 0.98
            },
            description: "Haus Verlassen",
            dimension: appartment.dimension,
            async callback(player: alt.Player) {
                alt.log(`${player.id} exiting interior! ${appartment_interiors[appartment.interior]}`)
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
                if (appartment_interiors[appartment.interior].ipl != "") {

                    alt.setTimeout(() => {

                        alt.emitClient(player, "removeIPL", appartment_interiors[appartment.interior].ipl)
                    }, 1000)
                }

            }
        })
    })
}





Athena.commands.register(
    "addhousing",
    "/addhousing [dim] [interior] - adds a new spot for housing",
    ['admin'],
    async (player: alt.Player, dim: string, interior: string) => {

        let appartment: IAppartment = {
            pos: player.pos,
            dimension: parseInt(dim),
            interior: parseInt(interior)
        }

        await Database.insertData<IAppartment>(
            appartment
            , "housing")


        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: {
                x: appartment.pos.x,
                y: appartment.pos.y,
                z: appartment.pos.z - 1
            },
            description: "Haus Betreten",
            async callback(player: alt.Player) {
                alt.log(`${player.id} interacted with an interaction! requesting ipl ${appartment_interiors[appartment.interior].ipl}`)
                if (appartment_interiors[appartment.interior].ipl != "") {
                    alt.emitClient(player, "requestIPL", appartment_interiors[appartment.interior].ipl)
                }
                alt.setTimeout(() => {
                    let pos = appartment_interiors[appartment.interior].exit
                    Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z)
                    Athena.player.safe.setDimension(player, appartment.dimension)
                    Athena.document.character.set(player, 'dimension', appartment.dimension);
                    Athena.document.character.set(player, 'interior', appartment_interiors[appartment.interior].ipl)
                }, 1000)

            }
        })
        Athena.controllers.interaction.append({
            isPlayerOnly: true,
            isVehicleOnly: false,
            position: {
                x: appartment_interiors[appartment.interior].exit.x,
                y: appartment_interiors[appartment.interior].exit.y,
                z: appartment_interiors[appartment.interior].exit.z - 1
            },
            description: "Haus Verlassen",
            dimension: appartment.dimension,
            async callback(player: alt.Player) {
                alt.log(`${player.id} exiting interior! ${appartment_interiors[appartment.interior]}`)
                let pos = appartment.pos
                Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z)
                Athena.player.safe.setDimension(player, 0)
                Athena.document.character.set(player, 'dimension', 0);
                Athena.document.character.set(player, "interior", null)
                if (appartment_interiors[appartment.interior].ipl != "") {
                    alt.setTimeout(() => {
                        alt.emitClient(player, "removeIPL", appartment_interiors[appartment.interior].ipl)
                    }, 1000)
                }


            }
        })
    },
);

