import { BaseEntity, BaseEntityParams, LocalEntity } from "./baseEntities";
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
    readonly content:Set<Interactable>= new Set<Interactable>();
    /**Characters that are currently in the room*/
    readonly occupants:Set<Character>= new Set<Character>();
    /**Whose room this is (relevant for Bedrooms and other room types)*/
    readonly owners:Set<Character>= new Set<Character>();

    constructor({name,nameColor,type}:{type?:RoomType} & BaseEntityParams){
        name??="Empty corridor";
        super({name,nameColor})
        this.type = type;
    }

    /**Removes an entity (Character or Interactable) from the room's list of entities */
    removeEntity(entity:LocalEntity){
        let set:Set<LocalEntity>;
        //Get correct set
        if(entity instanceof Character){
            set = this.occupants;
        }else if (entity instanceof Interactable){
            set = this.content;
        }else{
            throw new Error(`Can't remove invalid LocalEntity type '${typeof entity}'`)
        }

        //Remove
        return set.delete(entity)
    }

    /**Adds an entity (Character or Interactable) to the room's list of entities */
    addEntity(entity:LocalEntity){
        let set:Set<LocalEntity>;
        //Get correct set
        if(entity instanceof Character){
            set = this.occupants;
        }else if (entity instanceof Interactable){
            set = this.content;
        }else{
            throw new Error(`Can't add invalid LocalEntity type '${typeof entity}'`)
        }

        //add
        if(set.has(entity))
            return false;
        
        set.add(entity);
        return true;

    }
}

/**Possible types or rooms that exist */
export type RoomType = null | "Bedroom" | "Kitchen" | "Hall" | "Bathroom" ;

//TODO: Add room presets