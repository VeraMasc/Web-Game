import { Room } from "./house";

/**Describes the connections between rooms*/
export class Door {
    /**First room to connect */
    pointA?:Room;

    /**Second room to connect */
    pointB?:Room;

    constructor({pointA, pointB}:{pointA?:Room, pointB?:Room}){
        this.pointA = pointA;
        this.pointB = pointB;
    }
}