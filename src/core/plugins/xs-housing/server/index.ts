import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { IAppartment } from '../shared/interfaces/IAppartment';
import { appartment_interiors, special_interiors } from '../shared/config/interiors';
import { HousingFunctions } from './system';
import { play } from '@AthenaClient/camera/cinematic';

const PLUGIN_NAME = 'x-housing';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from Athena Server!');

    HousingFunctions.init()

});
Athena.commands.register(
    "rdf",
    "/rdf - request the doomsday Facility",
    ['admin'],
    (player) => {
        alt.emitClient(player, "requestInterior", special_interiors[0])
        Athena.player.teleport.toPosition(player, special_interiors[0].interior_pos)
    }
)

Athena.commands.register(
    "addhousing",
    "/addhousing [dim] [interior] - adds a new spot for housing",
    ['admin'],
    async (player: alt.Player, dim: string, interior: string) => {

        let appartment: IAppartment = {
            pos: {
                x: player.pos.x,
                y: player.pos.y,
                z: player.pos.z - 0.98
            },
            dimension: parseInt(dim),
            interior: appartment_interiors[parseInt(interior)],
            address: "Hub"
        }

        await Database.insertData<IAppartment>(
            appartment
            , "housing")

        HousingFunctions.createInsideInteraction(appartment)
        HousingFunctions.createOutsideInteraction(appartment)
    },
);






