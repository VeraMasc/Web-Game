import { Room } from "./house";



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

    constructor({pointA, pointB}:{pointA?:RoomRef, pointB?:RoomRef}){
        this.pointA = pointA;
        this.pointB = pointB;
    }

    /**Door has placeholder nodes values */
    get isPlaceholder(){
        return !(this.pointA instanceof Room && this.pointB instanceof Room)
    }

    /**Can you go through the door?*/
    get isOpen(){
        return !this.isPlaceholder
    }
}

/**References a room in order*/
export type AbsRoomPlhd = `#${bigint}`;

/**References a room relative to another */
export type RelRoomPlhd = bigint;

/**Contains all ways to reference a room indirectly */
export type RoomPlaceholder = RelRoomPlhd;



