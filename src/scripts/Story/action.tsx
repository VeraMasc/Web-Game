
/**Possible actions that can be taken by the player */
export class Action{
    /**HTML text used to describe the action*/
    description:string;

    constructor(desc:string){
        if(!desc?.length)//String is empty
            this.description="Placeholder action";
        else
            this.description=desc;
    }
}