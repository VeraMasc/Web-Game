import { StoryElement } from "../StoryElements";


/**Tagged {@link StoryArray} sequence for identification */

export type TaggedArray = [Tag, ...StoryElement[]];
/**Story tag. Acts like a reference point for other actions */

export class Tag {
    /**
     * @param id Identifier for the tag. No repeats within the same {@link StoryFunction}
     */
    constructor(public id: string) {
    }
}
