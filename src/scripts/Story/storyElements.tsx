import React from "react"
import { StoryState } from './storyState';
import {ReactTyped} from 'react-typed'

/** Defines and describes all the possible elements in a story function
 * @module
 */


/**Every possible type of element found in a story array */
export type StoryElement = string | JumpTo | Tag;

/**Every possible type of {@link StoryElement} that is not a control element
 * and has to be rendered when reached
*/
export type PassageElement = string | CustomPassage;

/**Sequence of story elements to play in order*/
export type StoryArray = StoryElement[]

/**Tagged {@link StoryArray} sequence for identification */
export type TaggedArray = [Tag,...StoryElement[]]

/**Lambda function that generates a part of the story on demand */
export type StoryFunction= ()=>StoryArray

/**Story link. Jumps to another portion of the story */
export class JumpTo{
    /**
     * @param fragment Story function to jumpt to. Null for current
     * @param tag *Tag within {@link fragment} to jump to (if any) 
     */
    constructor(public fragment:StoryFunction,public tag:string=null){

    }
}

/**Story tag. Acts like a reference point for other actions */
export class Tag{
    /**
     * @param id Identifier for the tag. No repeats within the same {@link StoryFunction}
     */
    constructor(public id:string){

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
        React.useEffect(this.onRender.bind(this),[]);
        return <span ref={ref}>{this.renderPassage(state)}</span>
    }

    /**Renders the on screen text part of the passage. Override this instead of render*/
    protected renderPassage(state:StoryState) {
        return <span>Default CustomPassage render</span>
    }

    /**What else to do when the element is rendered */
    onRender(){
    
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

export function RenderCustomPassage({state, passage,ref,...props}:CustomPassageProps){
    console.log(ref)
    return passage.renderEntry(state,ref)
}

