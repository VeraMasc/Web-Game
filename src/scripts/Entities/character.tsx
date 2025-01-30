import { Room } from "./house";


export class Character{

    /** Name of the character */
    name:string;

    /**Display color of the character's name */
    color:string;

    /**How healthy is the character from 0 to 100 */
    health:number=100;

    /**How sane the character is from 0 to 100 */
    sanity:number=100;

    /**How afraid the character is of you from 0 to 100 */
    fear:number=0;

    /**How aware the character is of your presence and nature from 0 to 100 */
    awareness:number=100;

    /**Where is the character currently? */
    currentLocation:Room;
    


    constructor(name:string, color:string=null){
        this.name = name;
        this.color = color;
    }

    /**Jumps character to a location regardless of validity or path*/
    jumpTo(){

    }

    /**Moves character through the world until it reaches the destination (if possible)*/
    walkTo(){
        //TODO:Implement pathfinding
    }

    /**Displays character name as HTML */
    toHtml(){
        return <span>Not implemented</span>
    }
}