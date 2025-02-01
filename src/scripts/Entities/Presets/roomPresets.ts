import { Room } from "../house";
import { knife } from "./itemPresets";
import { shower } from "./iteractPresets";

/**Kitchen preset */
export var kitchen = ()=> new Room({name:"Kitchen",type:"Kitchen"})
        .with( knife().asHolder());

/**Bathroom preset (shower) */
export var bathroom = ()=> new Room({name:"Bathroom",type:"Kitchen"})
        .with( shower() );