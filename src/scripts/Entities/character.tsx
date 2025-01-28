

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
    


    constructor(name:string, color:string=null){
        this.name = name;
        this.color = color;
    }

    /**Displays character name as HTML */
    toHtml(){

    }
}