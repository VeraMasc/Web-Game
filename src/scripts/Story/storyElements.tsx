import React from "react"
import { StoryState } from './StoryState';
import {ReactTyped} from 'react-typed'
import { state } from 'melonjs';
import { JumpTo } from "./FlowElements/FlowControl";
import { Tag } from "./FlowElements/FlowTags";
export type { TaggedArray } from "./FlowElements/FlowTags";


/** Defines and describes all the possible elements in a story function
 * @module
 */


/**Every possible type of element found in a story array */
export type StoryElement = string | ExecElement | Tag;

/**Every possible type of {@link StoryElement} that is not a control element
 * and has to be rendered when reached
*/
export type PassageElement = string | CustomPassage;

/**Sequence of story elements to play in order*/
export type StoryArray = StoryElement[]

/**Lambda function that generates a part of the story on demand */
export type StoryFunction= ()=>StoryArray


/**Encompasses all story elements that execute without rendering*/
export abstract class ExecElement{
    /**Function to execute when the story passes through this element */
    execute(state:StoryState){

    }
}

/**Parent class of all non string {@link PassageElement}*/
export abstract class CustomPassage{

    /**Renders the passage inside a log entry.
     * Do not override unless necessary, override {@link renderPassage} instead 
     * @param state Current state of the story, necessary for complex behaviors
     * @param ref Ref needed by {@link ReactTyped}
     */
    renderEntry(state:StoryState, ref?:React.RefObject<any>) {
        React.useEffect(this.onRender.bind(this,state),[]);
        return <span ref={ref}>{this.renderPassage(state)}</span>
    }

    /**Renders the on screen text part of the passage. Override this instead of render*/
    protected renderPassage(state:StoryState) {
        return <span>Default CustomPassage render</span>
    }

    /**What else to do when the element is rendered */
    onRender(state:StoryState){
    
    }
}

/**Props used to render custom passages */
export type CustomPassageProps={
    /**Current story state */
    state:StoryState, 
    /**Passage to render */
    passage:CustomPassage,
    /**Reference to the HTMLElement */
    ref?:React.RefObject<any>,
}   

/**Renderer of {@link CustomPassage} */
export function RenderCustomPassage({state, passage,ref,...props}:CustomPassageProps){
    return passage.renderEntry(state,ref)
}

