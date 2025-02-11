import { Room } from "../room";
import { knife } from "./itemPresets";
import { shower } from "./interactPresets";
import pre from "./presets"

/**Kitchen preset */
export var kitchen = ()=> new Room({name:"Kitchen",type:"Kitchen"})
        .with( knife().asHolder());

/**Bathroom preset (shower) */
export var bathroom = ()=> new Room({name:"Bathroom",type:"Kitchen", nameColor: pre.txColor.dodgerblue})
        .with( shower() );

/**Outside preset */
export var outside = ()=> new Room({name:"Outside",type:"Outside"});