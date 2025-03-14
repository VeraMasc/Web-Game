import {  StoryArray, StoryElement } from '../StoryElements';


/**Tagged {@link StoryArray} sequence for identification */

export type TaggedArray = [Tag, ...StoryElement[]];
/**Story tag. Acts like a reference point for other actions */

export class Tag {
    /**
     * @param id Identifier for the tag. No repeats within the same {@link StoryFunction}
     */
    constructor(public id: string) {
    }

    /**Finds the first tag with an ID in an array. Returns its index*/
    static findTag(array:StoryArray, tag:string){
        if(tag==null)
            return -1
        return array.findIndex((v)=>{
                if(!(v instanceof Tag))
                    return false;
                return v.id === tag;
            })
        
    }
}
