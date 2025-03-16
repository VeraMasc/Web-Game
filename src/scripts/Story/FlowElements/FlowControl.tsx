import { ExecElement, StoryFunction, StoryArray } from '../StoryElements';
import { StoryState } from '../StoryState';
import { Tag, TagId } from './FlowTags';

/**Possible targets for a {@FlowTo} element. (string)*/
export type FlowTarget = TagId | number 

/**Encompasses any {@link ExecElement} that changes the flow of the story*/
export abstract class FlowTo extends ExecElement{
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param target *Tag within {@link fragment} to jump to (if any)
     */
    constructor(public fragment: StoryFunction, public target: FlowTarget = null) {
        super();
    }

    static getTargetIndex( branch:StoryArray, target: FlowTarget):number{
        if(typeof target === 'string'){
            return Tag.findTag(branch,target)
        }
        return -1;
    }
}

/**Story goto. Jumps to another portion of the story */
export class JumpTo extends FlowTo {
    

    execute(state: StoryState): void {
        JumpTo.exec(state,this.fragment,this.target);
    }

    /**Executes the effect of {@link JumpTo} */
    static exec(state:StoryState,fragment: StoryFunction, target?: FlowTarget){
        let branch = fragment?.() ?? state.activeBranch;
        let index:number= FlowTo.getTargetIndex(branch, target)
    
        state.branchJump(branch,index)
    }
}


/**Story function call. Jumps to another portion of the story */
export class CallTo extends FlowTo {

    execute(state: StoryState): void {
        CallTo.exec(state,this.fragment,this.target);
    }

    /**Executes the effect of {@link CallTo} */
    static exec(state:StoryState,fragment: StoryFunction, target?: FlowTarget){
        let branch = fragment?.() ?? state.activeBranch;
        let index:number=FlowTo.getTargetIndex(branch, target);

        state.branchCall(branch,index)
    }
}
