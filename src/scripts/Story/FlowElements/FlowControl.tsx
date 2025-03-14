import { ExecElement, StoryFunction } from "../StoryElements";
import { StoryState } from '../StoryState';
import { Tag } from "./FlowTags";



/**Story link. Jumps to another portion of the story */
export class JumpTo extends ExecElement {
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param tag *Tag within {@link fragment} to jump to (if any)
     */
    constructor(public fragment: StoryFunction, public tag: string = null) {
        super();
    }


    /**Executes the effect of {@link JumpTo} */
    static exec(state:StoryState,fragment: StoryFunction, tag?: string){
        let branch = fragment?.() ?? state.activeBranch;
        let index:number=-1;

        if(tag!=null){ //Get tag index
            index = branch.findIndex((v)=>{
                if(!(v instanceof Tag))
                    return false;
                return v.id === tag;
            })
        }
        state.branchJump(branch,index)
        
    }
}
