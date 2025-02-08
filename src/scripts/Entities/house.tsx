import { BaseEntity } from "./baseEntities";
import { Interactable } from "./interactable";
import { Room } from "./Room";

/**Holds and manages the different environments of the house */
export class House extends BaseEntity{

    /**List of all the rooms in the house */
    rooms:Set<Room>=new Set<Room>()

    /**Like {@link Room.content} but applies the same {@link Interactable} to all rooms*/
    globalContent:Interactable[]

    //TODO: add connections between rooms

    /**Populates the house with the given rooms */
    with(...rooms:Room[]):this{
        for(let item of rooms) {
            item.parent = this;
            this.rooms.add(item)
        }
        
        return this
    }

    /**Resolves the door placeholders */
    resolveConnections(){
        let i=0;
        let roomArr = [...this.rooms];
        //Iterate rooms
        for(let room of roomArr){
            //Iterate room doors
            for(let door of room.doors){
                door.resolve(roomArr)
            }
        }
        return this;
    }
}


/**Possible types or rooms that exist */
export type RoomType = null | "Bedroom" | "Kitchen" | "Hall" | "Bathroom" ;

//TODO: Add room presets