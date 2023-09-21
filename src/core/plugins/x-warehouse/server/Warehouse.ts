import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';


let warehouses: Array<Warehouse> = new Array<Warehouse>


interface Warehouse {
    insidePos: alt.Vector3
    outsidePos: alt.Vector3
    ipl: string
}
// Warhouse MEdium
warehouses.push({
    insidePos: new alt.Vector3(1027.241943359375, -3101.589599609375, -38.99987030029297),
    outsidePos: new alt.Vector3(-181, -147, 94),
    ipl: "ex_exec_warehouse_placement_interior_2_int_warehouse_l_dlc_milo"
})
// Warehouse Large
warehouses.push({
    insidePos: new alt.Vector3(1072.3125, -3102.50732421875, -38.99995040893555),
    outsidePos: new alt.Vector3(-180, -144, 94),
    ipl: "ex_exec_warehouse_placement_interior_0_int_warehouse_m_dlc_milo"
})
// Warehouse Small
warehouses.push({
    insidePos: new alt.Vector3(1104.2183837890625, -3099.576416015625, -38.99995422363281),
    outsidePos: new alt.Vector3(-179, -141, 94),
    ipl: "ex_exec_warehouse_placement_interior_1_int_warehouse_s_dlc_milo"
})
//warhouse 1
warehouses.push({
    insidePos: new alt.Vector3(1009.5, -3196.6, -38.99682),
    outsidePos: new alt.Vector3(-178, -138, 94),
    ipl: "bkr_biker_interior_placement_interior_2_biker_dlc_int_ware01_milo"
})
//warhouse 2
warehouses.push({
    insidePos: new alt.Vector3(1051.491, -3196.536, -39.14842),
    outsidePos: new alt.Vector3(-177, -135, 94),
    ipl: "bkr_biker_interior_placement_interior_3_biker_dlc_int_ware02_milo"
})
//warhouse 3
warehouses.push({
    insidePos: new alt.Vector3(1093.6, -3196.6, -38.99841),
    outsidePos: new alt.Vector3(-176, -132, 94),
    ipl: "bkr_biker_interior_placement_interior_4_biker_dlc_int_ware03_milo"
})
//warhouse 4
warehouses.push({
    insidePos: new alt.Vector3(1121.897, -3195.338, -40.4025),
    outsidePos: new alt.Vector3(-175, -129, 94),
    ipl: "bkr_biker_interior_placement_interior_5_biker_dlc_int_ware04_milo"
})
//warhouse 5
warehouses.push({
    insidePos: new alt.Vector3(1165, -3196.6, -39.01306),
    outsidePos: new alt.Vector3(-174, -126, 94),
    ipl: "bkr_biker_interior_placement_interior_6_biker_dlc_int_ware05_milo"
})
//clubhouse 1
warehouses.push({
    insidePos: new alt.Vector3(1107.04, -3157.399, -37.51859),
    outsidePos: new alt.Vector3(-173, -123, 94),
    ipl: "bkr_biker_interior_placement_interior_0_biker_dlc_int_01_milo"
})
//clubhouse 2
warehouses.push({
    insidePos: new alt.Vector3(998.4809, -3164.711, -38.90733),
    outsidePos: new alt.Vector3(-172, -120, 94),
    ipl: "bkr_biker_interior_placement_interior_1_biker_dlc_int_02_milo"
})
//Cargarage
warehouses.push({
    insidePos: new alt.Vector3(994.5925, -3002.594, -39.64699),
    outsidePos: new alt.Vector3(-171, -117, 94),
    ipl: "imp_impexp_interior_placement_interior_1_impexp_intwaremed_milo_"
})

//Normal Cargo Ship
warehouses.push({
    insidePos: new alt.Vector3(-163.3628, -2385.161, 5.999994),
    outsidePos: new alt.Vector3(-168, -117, 94),
    ipl: "cargoship"
})


export function init() {
    warehouses.forEach((warehouse) => {
        let outsidePos = warehouse.outsidePos
        let insidePos = warehouse.insidePos
        let ipl = warehouse.ipl

        Athena.controllers.interaction.append({
            position: {
                x: outsidePos.x,
                y: outsidePos.y,
                z: outsidePos.z - 1
            },
            isPlayerOnly: true,
            isVehicleOnly: false,
            //description: "Warenlager Betreten",
            range: 2,
            callback(player) {
                alt.log(`${player.id} interacted with an interaction! requesting ipl ${ipl}`)
                alt.emitClient(player, "requestIPL", ipl)
                alt.setTimeout(() => {
                    Athena.player.safe.setPosition(player, insidePos.x, insidePos.y, insidePos.z)
                    Athena.document.character.set(player, 'interior', ipl)
                }, 1000)
            },
        })

        Athena.controllers.interaction.append({
            position: {
                x: insidePos.x,
                y: insidePos.y,
                z: insidePos.z - 1
            },
            isPlayerOnly: true,
            isVehicleOnly: false,
            //description: "Warenlager Verlassen",
            range: 2,
            callback(player) {
                alt.log(`${player.id} interacted with an interaction! requesting ipl ${ipl}`)

                Athena.player.safe.setPosition(player, outsidePos.x, outsidePos.y, outsidePos.z)
                alt.setTimeout(() => {
                    alt.emitClient(player, "removeIPL", ipl)
                    Athena.document.character.set(player, 'interior', null)
                }, 1000)
            },
        })

        /*Athena.controllers.blip.append({
            pos: outsidePos,
            text: "Warenlager",
            color: 38,
            scale: 1,
            shortRange: true,
            sprite: 351

        })*/

        Athena.controllers.marker.append({
            pos: {
                x: insidePos.x,
                y: insidePos.y,
                z: insidePos.z - 1
            },
            color: new alt.RGBA(0, 255, 0),
            type: 25,
            maxDistance: 10,
            scale: new alt.Vector3(1.5, 1.5, 0)
        })
        Athena.controllers.marker.append({
            pos: {
                x: outsidePos.x,
                y: outsidePos.y,
                z: outsidePos.z - 1
            },
            color: new alt.RGBA(0, 255, 0),
            type: 25,
            maxDistance: 10,
            scale: new alt.Vector3(1.5, 1.5, 0)
        })
    })

}