import { StoryFunction } from "../StoryElements";


/**Story link. Jumps to another portion of the story */

export class JumpTo {
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param tag *Tag within {@link fragment} to jump to (if any)
     */
    constructor(public fragment: StoryFunction, public tag: string = null) {
    }
}
