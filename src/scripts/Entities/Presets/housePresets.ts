import { House } from '../house';
import { kitchen, bathroom } from './roomPresets';
import pre from "./presets"


export var baseHouse = () => new House({name:"House", nameColor:pre.txColor.firebrick})
    .with(
        kitchen(),
        bathroom(),
        bathroom().nameAs({name:"Bathroom 2"}),
    )