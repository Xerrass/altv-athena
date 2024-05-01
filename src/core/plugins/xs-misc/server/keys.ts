import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { Doors } from '@AthenaShared/information/doors';
import { Door } from '@AthenaShared/interfaces/door';
import { play } from '@AthenaClient/camera/cinematic';
import { BaseItem } from '@AthenaShared/interfaces/item';


let keys: Array<string> = new Array<string>
let double_doors: Array<number> = new Array<number>

double_doors[0] = 1
double_doors[1] = 0

Athena.commands.register("rd", "/rd - register a new door", ['admin'], (player: alt.Player, uid: string) => {

    /*let door: Door = {
        isUnlocked: false,
        model: model,
        pos: pos,
        uid: uid,
    }

    Database.insertData<Door>(door, "doors")
    Athena.controllers.doors.append(door) */
})





export async function generateKeyItems() {
    let behavior = {
        canDrop: false,
        canStack: false,
        isToolbar: false,
        isClothing: false,
        destroyOnDrop: false,
        isCustomIcon: false,
        isEquippable: false,
        isWeapon: false,
        canTrade: true,
    }

    for (let door of Doors) {

        let keyitem: BaseItem = {
            dbName: "key-item-door-" + door.uid,
            name: "Schlüssel " + door.uid,
            icon: "custom-icon",
            data: {
                double_door: false,
                door_ids: [door.uid]
            },
            behavior: behavior

        }

        keys.push(keyitem.dbName)
        await Athena.systems.inventory.factory.upsertAsync(keyitem);
    }

    let key_item_door_0: BaseItem = {
        dbName: "key-item-door-staatsbank",
        name: "Generalschlüssel Staatsbank",
        icon: "custom-icon",
        data: {
            door_ids: [0, 1],

        },
        behavior: behavior

    }
    await Athena.systems.inventory.factory.upsertAsync(key_item_door_0);
    keys.push(key_item_door_0.dbName)
}




alt.onClient("toggledoor_key_press", async (player: alt.Player) => {
    const doorsByDistance = Doors.sort((a, b) => {
        const distA = Athena.utility.vector.distance(player.pos, a.pos);
        const distB = Athena.utility.vector.distance(player.pos, b.pos);

        return distA - distB;
    });

    const closestDoor = doorsByDistance[0];
    if (!closestDoor) {
        Athena.player.emit.message(player, 'No doors found.');
        return;
    }

    if (Athena.utility.vector.distance(player.pos, closestDoor.pos) >= 5) {
        Athena.player.emit.message(player, 'No door in reach found.');
        return;
    }

    let doors_player_can_open: Array<number> = new Array<number>
    for (let key of keys) {
        if (await Athena.player.inventory.has(player, key, 1)) {
            let item = Athena.systems.inventory.factory.getBaseItem<BaseItem>(key)
            for (let doorid in item.data.door_ids) {
                doors_player_can_open.push(doorid)
            }

        }
    }
    //console.log(doors_player_can_open)
    if (closestDoor.uid in doors_player_can_open) {
        Athena.controllers.doors.update(closestDoor.uid, !closestDoor.isUnlocked);
        //console.log(double_doors[closestDoor.uid])
        if (parseInt(double_doors[closestDoor.uid]) >= 0) {
            //console.log(closestDoor.isUnlocked)
            Athena.controllers.doors.update(double_doors[closestDoor.uid].toString(), closestDoor.isUnlocked);

        }

    }

    /*
    let key_item = await Athena.player.inventory.has(player, "key-item-door-" + closestDoor.uid, 1)
    alt.log(key_item)
    if (key_item) {
        let item = Athena.systems.inventory.factory.getBaseItem<BaseItem>("key-item-door-" + closestDoor.uid)
        if (item.data)
            Athena.controllers.doors.update(closestDoor.uid, !closestDoor.isUnlocked);
    }*/

})