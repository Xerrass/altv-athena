import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { progressBar } from '@AthenaClient/screen';
import { BaseItem, SharedItem } from '@AthenaShared/interfaces/item';
import { NotifyController } from '@AthenaPlugins/fnky-notifications/server/index';

let harvest_sites: Array<Harvest_Data> = new Array<Harvest_Data>
let harvest_running: boolean = false

interface Harvest_Data {
    pos: alt.IVector3
    isPlayerOnly: boolean
    isVehicleOnly: boolean
    color: alt.RGBA
    distance: number
    time: number
    text: string
    item: BaseItem
    quantity_min: number
    quantity_max: number
}

harvest_sites.push({
    pos: new alt.Vector3(-153, -120, 93.7),
    isPlayerOnly: true,
    isVehicleOnly: false,
    color: new alt.RGBA(0, 242, 255),
    distance: 1,
    text: "Harvest Testing",
    time: 5000,
    item: {
        data: {}, dbName: "kieselsteine", icon: "", name: "Kieselsteine", weight: 0.1, maxStack: 100, behavior: {
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
    },
    quantity_min: 0,
    quantity_max: 10
})


export async function initHarvest() {
    for (let site of harvest_sites) {
        await Athena.systems.inventory.factory.upsertAsync({
            dbName: site.item.dbName,
            data: site.item.data,
            icon: site.item.icon,
            name: site.item.name,
            weight: site.item.weight,
            maxStack: site.item.maxStack,
            behavior: site.item.behavior
        })

        Athena.controllers.interaction.append({
            position: { x: site.pos.x, y: site.pos.y, z: site.pos.z - 1 },
            isPlayerOnly: site.isPlayerOnly,
            isVehicleOnly: site.isVehicleOnly,
            callback(player) {
                if (!harvest_running) {
                    harvest_running = !harvest_running
                    Athena.player.emit.createProgressBar(player, { position: { x: site.pos.x, y: site.pos.y, z: site.pos.z }, color: site.color, distance: site.distance, milliseconds: site.time, text: site.text })
                    alt.setTimeout(() => {
                        if (Athena.utility.vector.distance(player.pos, site.pos) <= site.distance) {
                            Athena.player.inventory.add(player, { dbName: site.item.dbName, quantity: getRandomInt(site.quantity_max) + site.quantity_min, data: {} })
                        } else {
                            NotifyController.send(player, 2, 5, 'Fehler', 'Lorem ipsum dolor sit amet, adipiscing elit, <b><font color="#3DBA39">sed do eiusmod</b></font>');
                        }
                        harvest_running = false
                    }, site.time + 500)
                }
            },
        })

        Athena.controllers.marker.append({
            pos: { x: site.pos.x, y: site.pos.y, z: site.pos.z },//- 0.98 },
            color: new alt.RGBA(0, 255, 0),
            type: 20,
            maxDistance: 10,
            scale: new alt.Vector3(site.distance, site.distance, site.distance)
        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}