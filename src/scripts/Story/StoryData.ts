import { EventResult } from "./StoryEvents";



/**Structure of the internal story variables*/
export class StoryData{
    /**Contains the result of the last event */
    lastEvent?: EventResult;
    /**Story flags (indicates if something specific has happened or not) */
    [key: FlagPattern]: boolean;
    /**Other data */
    [key: string]: unknown;

    /**Clears all the story data */
    clear(){
        for(let k of Object.keys(this)){
            delete this[k];
        }
    }

    /**Gets a flag value 
     * @param name flag name (without the flag pattern)
    */
    getFlag(name:string):boolean{
        return this[flagName(name)]
    }
    /**Sets a specific flag 
     * @param name flag name (without the flag pattern)
    */
    setFlag(name:string,value:boolean){
        this[flagName(name)]=value;
    }

    /**Calls a function on a flag value and returns the modified value
     * @param name flag name (without the flag pattern)
     * @param func function to modify the value
    */
    callFlag(name:string,func:(v:boolean)=>boolean){
        return this[flagName(name)] = func?.(this[flagName(name)])
    }
}


/**Gets the name of a flag */
var flagName = (v:string):`flag_${string}`=>`flag_${v}`

/**Name pattern of a {@link StoryData} flag property */
export type FlagPattern = ReturnType<typeof flagName>