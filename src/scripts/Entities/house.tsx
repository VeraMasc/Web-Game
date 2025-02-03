import { BaseEntity, BaseEntityParams, LocalEntity } from "./baseEntities";
import { Character } from "./character";
import { Interactable } from "./interactable";
import { Door } from './door';

/**Holds and manages the different environments of the house */
export class House extends BaseEntity{

    /**List of all the rooms in the house */
    rooms:Room[]=[]

    /**Like {@link Room.content} but applies the same {@link Interactable} to all rooms*/
    globalContent:Interactable[]

    //TODO: add connections between rooms

    /**Generates a new instance of the house with the given rooms */
    with(...rooms:Room[]){
        let newHouse = new House(this)
        newHouse.rooms=rooms;
        return newHouse;
    }
}


/**Describes a section of a House */
export class Room extends BaseEntity{
    /**The kind of room this is */
    type:RoomType;

    /**Which house it's part of*/
    parent:House;

    /**Things in the room that one can interact with */
    readonly content:Set<Interactable>= new Set<Interactable>();

    /**Characters that are currently in the room*/
    readonly occupants:Set<Character>= new Set<Character>();

    /**Whose room this is (relevant for Bedrooms and other room types)*/
    readonly owners:Set<Character>= new Set<Character>();

    /**Connections that the room has with other rooms */
    readonly doors:Set<Door>= new Set<Door>();

    /**Creates a section of the house from params or another instance*/
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

    /**Generates a new instance of the room with the given content */
    with(...entities:LocalEntity[]){
        let newRoom = new Room(this)
        for(let e of entities){
            newRoom.addEntity(e);
        }
        return newRoom;
    }
}

/**Possible types or rooms that exist */
export type RoomType = null | "Bedroom" | "Kitchen" | "Hall" | "Bathroom" ;

//TODO: Add room presets