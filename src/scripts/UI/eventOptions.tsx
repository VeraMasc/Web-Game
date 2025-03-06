import { useEffect } from "react";
import { CatchError } from "./UIutils";
import { EventLog } from './eventLog';
import { CustomPassage } from "../Story/storyElements";
import { StoryState } from '../Story/storyState';
import { EventPassage } from '../Story/storyEvents';
import React from "react";
import { atom, PrimitiveAtom, useAtomValue } from "jotai";

/**Controls the data ivolved in the events that the player interacts with */
export class EventDialogue {
    //TODO: Better event type
    value= atom(null as EventPassage)
    storyState?:StoryState;

    renderEvent(){
        let event = useAtomValue(this.value)
        console.warn("Rendering dialogue")
        return event?.renderDialogue(this.storyState)
    }
}


/**React component to render the player choices */
export function RenderEventDialogue({event}:{event:EventDialogue}){
    //TODO: Add way to move optionselection
    //TODO: Add actual option rendering
    useEffect(()=>console.warn("Options"),[]);
    return <div id="eventDialogue">
                <CatchError>
                    {event.renderEvent()}
                </CatchError>    
            </div>
            
}

