import { LocalEntity, LocalEntityParams } from "./baseEntities";
import { Room } from "./house";

/**Defines an NPC that exists in the world*/
export class Character extends LocalEntity{

    /**How healthy is the character from 0 to 100 */
    health:number=100;

    /**How sane the character is from 0 to 100 */
    sanity:number=100;

    /**How afraid the character is of you from 0 to 100 */
    fear:number=0;

    /**How aware the character is of your presence and nature from 0 to 100 */
    awareness:number=100;

    /**Where is the character currently? */
    readonly currentLocation:Room;
    

    constructor({name,nameColor,location}:LocalEntityParams){
        super({name,nameColor,location})
  
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