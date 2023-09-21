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
let ipls: Array<string> = new Array<string>

ipls.push("tr_tuner_meetup")
ipls.push("tr_tuner_race_line")
ipls.push("tr_tuner_shop_burton")
ipls.push("tr_tuner_shop_mesa")
ipls.push("tr_tuner_shop_mission")
ipls.push("tr_tuner_shop_rancho")
ipls.push("tr_tuner_shop_strawberry")



alt.loadDefaultIpls()

for (let ipl of ipls) {
    native.requestIpl(ipl)
    alt.log(`Loaded IPL ${ipl}`)
}
