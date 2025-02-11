import { BaseEntity } from "./baseEntities";
import { Interactable } from "./interactable";
import { Room } from "./room";
import { Door } from './door';

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

    /**Resolves the door placeholders 
     * @param exterior room to use as the exterior of the house for resolution
    */
    resolveConnections(exterior:Room=null){
        let i=0;
        let roomArr = [...this.rooms];
        //Iterate rooms
        for(let room of roomArr){
            //Iterate room doors
            for(let door of room.doors){
                door.resolve(roomArr, exterior)
            }
        }
        return this;
    }

    clone(): this { 
        let newHouse = super.clone()
        //Clone rooms
        let rMap = new Map<Room,Room>(); //Which new room matches the old
        let dSet = new Set<Door>(); //Set of all doors in OG house

        for(let r of this.rooms){
            let newRoom = r.clone();
            newHouse.rooms.add(newRoom);
            rMap.set(r,newRoom); //Store equivalence

            for(let d of r.doors){
                dSet.add(d) //Store doors without duplicates
            }
        }

        //Clone doors
        for(let d of dSet){
            let points = d.points;
            let [pointA, pointB] = Door.remapPoints(points,rMap);
            let newDoor = new Door({pointA, pointB});
                
        }
        
        return newHouse;
    }
}

