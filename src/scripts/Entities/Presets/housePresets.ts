import { House } from '../house';
import { kitchen, bathroom } from './roomPresets';


export var baseHouse = () => new House({name:"House"})
    .with(
        kitchen(),
        bathroom(),
        bathroom().nameAs({name:"Bathroom 2"}),
    )