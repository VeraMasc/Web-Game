import { useEffect } from "react";
import { CatchError } from "./UIutils";
import { PassageLog } from './PassageLog';
import { CustomPassage } from "../Story/StoryElements";
import { StoryState } from '../Story/StoryState';
import { EventPassage } from '../Story/StoryEvents';
import React from "react";
import { atom, getDefaultStore, PrimitiveAtom, useAtomValue } from "jotai";

/**Controls the data ivolved in the events that the player interacts with */
export class EventDialog {
    value= atom(null as EventPassage)
    storyState?:StoryState;

    setActiveEvent(event:EventPassage,state:StoryState){
        let store = getDefaultStore();
        //TODO: move active event to story
        store.set(PassageLog.instance.activeEvent.value,event);
        this.storyState = state;
    }

    renderEvent(){
        let event = useAtomValue(this.value)
        console.warn("Rendering dialogue")
        return event?.renderDialogue(this.storyState)
    }
}


/**React component to render the player choices */
export function RenderEventDialog({event}:{event:EventDialog}){
    //TODO: Add way to move optionselection
    //TODO: Add actual option rendering
    useEffect(()=>console.warn("Options"),[]);
    return <div id="eventDialog">
                <CatchError>
                    {event.renderEvent()}
                </CatchError>    
            </div>
            
}

