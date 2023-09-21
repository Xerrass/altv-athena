import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { BlipColor } from 'alt-server';

export let blips: Array<Blip_Data> = new Array<Blip_Data>

interface Blip_Data {
    color: alt.BlipColor
    pos: alt.Vector3
    scale: number
    shortRange: boolean
    text: string
    sprite: alt.BlipSprite
}



blips.push({ color: 53, pos: new alt.Vector3(1208, -1403, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(-71, -1765, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(-721, -939, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(-1437, -276, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(-2097, -316, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(-2552, 2335, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(180, 6606, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(1705, 6416, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(1689, 4932, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(2009, 3776, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(1206, 2657, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(261, 2604, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(1181, -333, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(2580, 358, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(818, -1025, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(619, 271, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(52, 2777, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(1042, 2671, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })
blips.push({ color: 53, pos: new alt.Vector3(2677, 3261, 34), scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 })



export function generateBlips() {
    for (let blip of blips) {
        Athena.controllers.blip.append({
            color: blip.color,
            pos: blip.pos,
            scale: blip.scale,
            shortRange: blip.shortRange,
            text: blip.text,
            sprite: blip.sprite
        })
    }
}
