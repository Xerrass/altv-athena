import * as alt from 'alt-client';
import * as native from 'natives'
import * as Athena from '@AthenaClient/api';
const THE_LETTER_L = 76


import './harvest'

Athena.systems.hotkeys.add({
    key: THE_LETTER_L,
    description: "Open and Close Doors around you",
    identifier: "open_doors_key_l",
    keyDown: () => {
        alt.emitServer("toggledoor_key_press")
    },


})



alt.loadDefaultIpls()

alt.everyTick(() => {
    let componentsToHide: Array<number> = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 18, 21, 22]
    componentsToHide.forEach((component: number) => {
        //native.hideHudComponentThisFrame(component)
    })

})