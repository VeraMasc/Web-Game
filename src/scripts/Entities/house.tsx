import { Character } from "./character";
import { Interactable } from "./interactable";

/**Holds and manages the different environments of the house */
export class House{
    /**List of all the rooms in the house */
    rooms:Room[]=[]

    /**Like {@link Room.content} but applies the same {@link Interactable} to all rooms*/
    globalContent:Interactable[]
}


/**Describes a section of a House */
export class Room{
    name:string;
    /**The kind of room this is */
    type:RoomType;
    /**Things in the room that one can interact with */
    content:Interactable[]=[]
    /**Characters that are currently in the room*/
    occupants:Character[]=[]
    /**Whose room this is (relevant for Bedrooms and other room types)*/
    owners:Character[]=[]

    constructor(name:string=null,type:RoomType=null){
        this.name=name??"Empty corridor"
        this.type = type;
    }
}

/**Possible types or rooms that exist */
export type RoomType = null | "Bedroom" | "Kitchen" | "Hall" | "Bathroom" ;