import { ExecElement, StoryFunction } from "../StoryElements";
import { StoryState } from '../StoryState';
import { Tag } from "./FlowTags";



/**Story goto. Jumps to another portion of the story */
export class JumpTo extends ExecElement {
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param tag *Tag within {@link fragment} to jump to (if any)
     */
    constructor(public fragment: StoryFunction, public tag: string = null) {
        super();
    }

    execute(state: StoryState): void {
        JumpTo.exec(state,this.fragment,this.tag);
    }

    /**Executes the effect of {@link JumpTo} */
    static exec(state:StoryState,fragment: StoryFunction, tag?: string){
        let branch = fragment?.() ?? state.activeBranch;
        let index:number=Tag.findTag(branch,tag);

        state.branchJump(branch,index)
        
    }
}


/**Story function call. Jumps to another portion of the story */
export class CallTo extends ExecElement {
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param tag *Tag within {@link fragment} to jump to (if any)
     */
    constructor(public fragment: StoryFunction, public tag: string = null) {
        super();
    }

    execute(state: StoryState): void {
        JumpTo.exec(state,this.fragment,this.tag);
    }

    /**Executes the effect of {@link JumpTo} */
    static exec(state:StoryState,fragment: StoryFunction, tag?: string){
        let branch = fragment?.() ?? state.activeBranch;
        let index:number=Tag.findTag(branch,tag);

        state.branchCall(branch,index)
    }
}
