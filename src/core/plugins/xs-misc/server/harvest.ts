import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { BaseItem } from '@AthenaShared/interfaces/item';
import { NotifyController } from '@AthenaPlugins/fnky-notifcations/server/index';
import { Blip } from '@AthenaShared/interfaces/blip';

let harvest_sites: Array<Harvest_Site> = new Array<Harvest_Site>
let harvest_running: boolean = false
const debug: boolean = true
interface Harvest_Site {

    name: string
    blip_data: Blip
    interaction: {
        isPlayerOnly: boolean
        isVehicleOnly: boolean
        distance: number
    }
    pb: {
        color: alt.RGBA
        text: string
    }
    havest_time: number
    item: Array<HarvestItem>
    harvest_spots: Array<Harvest_Spot>
}

interface Harvest_Spot {
    pos: alt.IVector3
}
interface HarvestItem extends BaseItem {
    quantity_min: number
    quantity_max: number
}

interface Harvest_Data {
    pos: alt.IVector3
    isPlayerOnly: boolean
    isVehicleOnly: boolean
    color: alt.RGBA
    distance: number
    time: number
    text: string
    item: HarvestItem

}

harvest_sites.push({
    name: "Apfel Farm",

    blip_data: {
        pos: new alt.Vector3(350, 6521, 28.6),
        color: 1,
        scale: 1,
        shortRange: true,
        sprite: 270,
        text: "Apfel Farm"
    },
    pb: {
        color: new alt.RGBA(255, 0, 0),
        text: "Äpfel Sammeln"
    },
    havest_time: 21 * 1000,
    interaction: {
        distance: 4,
        isPlayerOnly: true,
        isVehicleOnly: false
    },
    item: [
        {
            dbName: "apple",
            name: "Apfel",
            icon: "",
            data: {},
            weight: 0.2,
            maxStack: 100,
            behavior: {
                canDrop: true,
                canStack: true,
                isToolbar: false,
                isClothing: false,
                destroyOnDrop: true,
                isCustomIcon: false,
                isEquippable: false,
                isWeapon: false,
                canTrade: true,
            },
            quantity_max: 10,
            quantity_min: 1
        }
    ],
    harvest_spots: [
        {
            pos: new alt.Vector3(369, 6531, 28.4),
        },
        { pos: new alt.Vector3(361.71, 6530.95, 28.363) }
    ]
})

harvest_sites.push({
    name: "Salat Feld",
    havest_time: 5000,
    pb: {
        color: new alt.RGBA(0, 255, 0),
        text: "Salat Pflücken"
    },
    harvest_spots: [
        { pos: new alt.Vector3(480, 6487.2, 30.03) }
    ],
    blip_data: {
        color: 2,
        pos: new alt.Vector3(480, 6487.2, 30.03),
        scale: 1,
        shortRange: true,
        sprite: 270,
        text: "Salat Feld"
    },
    interaction: {
        distance: 30,
        isPlayerOnly: true,
        isVehicleOnly: false,
    },
    item: [
        {
            dbName: "salat-kopf",
            name: "Salat Kopf",
            icon: "salat-kopf",
            data: {},
            quantity_max: 5,
            quantity_min: 2,
            behavior: {
                canDrop: true,
                canStack: true,
                isToolbar: false,
                isClothing: false,
                destroyOnDrop: true,
                isCustomIcon: false,
                isEquippable: false,
                isWeapon: false,
                canTrade: true,
            }
        }
    ]

})





export async function initHarvest() {
    for (let site of harvest_sites) {
        site.item.forEach(async (item) => {
            await Athena.systems.inventory.factory.upsertAsync({
                dbName: item.dbName,
                data: item.data,
                icon: item.icon,
                name: item.name,
                weight: item.weight,
                maxStack: item.maxStack,
                behavior: item.behavior
            })
        })
        site.harvest_spots.forEach((spot) => {
            Athena.controllers.interaction.append({
                position: { x: spot.pos.x, y: spot.pos.y, z: spot.pos.z - 1 },
                isPlayerOnly: site.interaction.isPlayerOnly,
                isVehicleOnly: site.interaction.isVehicleOnly,
                range: site.interaction.distance,
                callback(player: alt.Player) {
                    if (!harvest_running) {
                        harvest_running = !harvest_running
                        Athena.player.emit.createProgressBar(
                            player,
                            {
                                position: spot.pos,
                                color: site.pb.color,
                                distance: site.interaction.distance,
                                milliseconds: site.havest_time,
                                text: site.pb.text
                            })
                        alt.setTimeout(() => {
                            if (Athena.utility.vector.distance(player.pos, spot.pos) <= site.interaction.distance) {
                                site.item.forEach((item) => {
                                    let quantity = getRandomInt(item.quantity_max) + item.quantity_min;
                                    Athena.player.inventory.add(player, { dbName: item.dbName, quantity: quantity, data: {} })
                                    NotifyController.send(player, 2, 5, 'Sammeln', `Du hast ${quantity} ${item.name} gesammelt`);

                                })

                            } else {
                                NotifyController.send(player, 3, 5, 'Fehler', `Du hast dich zu weit entfernt.`);
                            }
                            harvest_running = false
                        }, site.havest_time)
                    }
                },
            })
            if (debug) {
                Athena.controllers.marker.append({
                    pos: { x: spot.pos.x, y: spot.pos.y, z: spot.pos.z - 0.98 },
                    color: new alt.RGBA(0, 255, 0),
                    type: 25,
                    maxDistance: 10,
                    scale: new alt.Vector3(site.interaction.distance)
                })
            }



        })
        Athena.controllers.blip.append(site.blip_data)
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}