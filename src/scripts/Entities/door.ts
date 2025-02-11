import { Room } from "./Room";

//TODO: Implement cloning doors

//TODO: Implement assigning doors

//TODO: Implement merging identical doors

/**References a Room directly or through a placeholder value.
 * numeric values are relative to room order in house.
*/
export type RoomRef = Room|RoomPlaceholder;

/**Describes the connections between rooms*/
export class Door {
    /**First room to connect */
    pointA?:RoomRef;

    /**Second room to connect */
    pointB?:RoomRef;

    /**Places in the world where the door is */
    locations:Room[]=[];

    /**Returns the points as a list */
    get points(){
        return [this.pointA,this.pointB]
    }

    /**Sets the points as a list */
    set points(value:RoomRef[]){
        [this.pointA,this.pointB] = value;
    }

    constructor({pointA, pointB}:{pointA?:RoomRef, pointB?:RoomRef}){
        this.pointA = pointA;
        this.pointB = pointB;
        
        //Assign to rooms if not a placeholder
        if(!this.isPlaceholder){
            this.setInRooms(this.points as Room[])
        }
    }

    /**Door has placeholder nodes values */
    get isPlaceholder(){
        return !(this.pointA instanceof Room && this.pointB instanceof Room)
    }

    /**Can you go through the door?*/
    get isOpen(){
        return !this.isPlaceholder
    }

    /**Checks if the doors are basically interchangeable */
    isEquivalent(other:Door){
        throw "Not implemented";
        return JSON.stringify(this) === JSON.stringify(other);
    }

    /**Resolves the door's placeholder connections
     * @param context rooms in the same house as the door
     * @param exterior room to use as the exterior of the house for resolution
      */
    resolve(context:Room[], exterior:Room=null){
        if(!this.isPlaceholder)
            return;

        //Resolve room values
        this.points = this.points.map((p,n) => {
            //Ignore references
            if(p instanceof Room || p == null)
                return p; 
            //Resolve absolute
            if(typeof p === "string" && p.startsWith("#")){
                let index = parseInt(p.slice(1))
                if(index == -1) //Resolve exterior
                    return exterior ?? p; 
                return context[index];
            }
            //Resolve relative
            if(typeof p === "number"){
                let index = Math.trunc(p);
                return context[n+index];
            }

            console.error("Invalid room reference: "+p)
            
        });

        //Finish assignation
        this.setInRooms(this.points as Room[])
    }

    /**Checks if it's a reference to a room (or null) */
    static isRef(ref:RoomRef){
        return  ref instanceof Room || ref == null;
    }
    
    /**Returns if the door is assigned to the room */
    isInRoom(room:Room){
        return this.locations.includes(room);
    }

    /**Sets the rooms the door is actually found in */
    setInRooms(rooms:Room[]){
        this.removeInRooms();

        for(let r of rooms){
            this.locations.push(r); //Add location
            r.doors.add(this);
        }
    }

    /**Removes the door from all rooms*/
    removeInRooms(){
        for(let r of this.locations){
            r.doors.delete(this);
        }
        this.locations =[];
    }

    /**Remaps door references using an equivalence map*/
    static remapPoints(points:RoomRef[],roomMap:Map<Room,Room>){
        //TODO: Move to rooms class?
        return points.map(p=>{
            if(Door.isRef(p))
                return p; //Ignore unresolved references

            return roomMap.get(p as Room) ?? null;
        })
    }
    
}

/**References a room in order*/
export type AbsRoomPlhd = `#${number}`;

/**References a room relative to another */
export type RelRoomPlhd = number;

/**Contains all ways to reference a room indirectly */
export type RoomPlaceholder = RelRoomPlhd|AbsRoomPlhd;



