import { LocalEntity, LocalEntityParams } from "./baseEntities";
import { Room } from "./house";
import { World } from "./world";

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

    

    constructor({name,nameColor,location}:LocalEntityParams){
        super({name,nameColor,location})
        //Add character to world
        World.instance.characters.add(this);
        
    }

    

    /**Displays character name as HTML */
    toHtml(){
        return <span>Not implemented</span>
    }

    /**Removes the character from the game entirely */
    destroy(){
        if(this.currentLocation){ //Remove from location
            this.currentLocation.removeEntity(this);
        }
        World.instance.characters.delete(this);
    }
}