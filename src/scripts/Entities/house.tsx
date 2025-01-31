import { BaseEntity, BaseEntityParams } from "./baseEntities";
import { Character } from "./character";
import { Interactable } from "./interactable";

/**Holds and manages the different environments of the house */
export class House extends BaseEntity{

    /**List of all the rooms in the house */
    rooms:Room[]=[]

    /**Like {@link Room.content} but applies the same {@link Interactable} to all rooms*/
    globalContent:Interactable[]
}


/**Describes a section of a House */
export class Room extends BaseEntity{
    /**The kind of room this is */
    type:RoomType;
    /**Things in the room that one can interact with */
    readonly content:Interactable[]=[]
    /**Characters that are currently in the room*/
    readonly occupants:Character[]=[]
    /**Whose room this is (relevant for Bedrooms and other room types)*/
    readonly owners:Character[]=[]

    constructor({name,nameColor,type}:{type?:RoomType} & BaseEntityParams){
        name??="Empty corridor";
        super({name,nameColor})
        this.type = type;
    }
}

/**Possible types or rooms that exist */
export type RoomType = null | "Bedroom" | "Kitchen" | "Hall" | "Bathroom" ;

//TODO: Add room presets