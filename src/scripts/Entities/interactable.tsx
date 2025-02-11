import { LocalEntity, LocalEntityParams } from "./baseEntities";
import { Character } from "./character";
import { House } from "./house";
import { Room } from "./room";

/**Elements of the world that can be interacted with*/
export class Interactable extends LocalEntity{
    /**Who owns (and therefore uses) the object*/
    owners:Character[]=[]

    constructor({name,nameColor,location}:LocalEntityParams){
            super({name,nameColor,location})
      
    }
}