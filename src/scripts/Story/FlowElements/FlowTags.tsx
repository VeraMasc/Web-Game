import {  StoryArray, StoryElement } from '../StoryElements';


/**Tagged {@link StoryArray} sequence for identification */

export type TaggedArray = [Tag, ...StoryElement[]];

/**Alias to distinguish Ids of {@link tag} from other strings */
export type TagId = string;

/**Story tag. Acts like a reference point for other actions */
export class Tag {
    /**
     * @param id Identifier for the tag. No repeats within the same {@link StoryFunction}
     */
    constructor(public id: string) {
    }

    /**Finds the first tag with an ID in an array. Returns the index-1
     * @param [failWarning=true] if true the function will give a warning when it fails
    */
    static findTag(array:StoryArray, tag:string, failWarning=true){
        if(tag==null)
            return -1
        let ret = array.findIndex((v)=>{
            if(v instanceof Array) //For Tagged arrays
                v = v[0];
            if(v instanceof Tag)
                return v.id === tag;
            return false;
        })
        if(ret > -1){
            ret-=1;
        } else if( failWarning)
            console.warn(`Failed to find TagId "${tag}" in`, array);
        return ret;
        
        
    }
}
