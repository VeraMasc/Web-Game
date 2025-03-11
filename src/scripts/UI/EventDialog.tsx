import { useEffect } from "react";
import { CatchError } from "./UIutils";
import { PassageLog } from './PassageLog';
import { CustomPassage } from "../Story/StoryElements";
import { StoryState } from '../Story/StoryState';
import { EventPassage } from '../Story/StoryEvents';
import React from "react";
import { atom, getDefaultStore, PrimitiveAtom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";

/**Controls the data ivolved in the events that the player interacts with */
export class EventDialog {
    /**Describes the current state of the story that the dialog is representing */
    get storyState(){
        //TODO: maybe move the state handling to Story?
        return getDefaultStore().get(this.storyStateAtom);
    };

    set storyState(value:StoryState){
        getDefaultStore().set(this.storyStateAtom,value);
    };

    /**Contains the atom of {@link storyState} */
    private storyStateAtom:PrimitiveAtom<StoryState>=atom(null as StoryState);

    /**Lets us check the active event of the story state and if it has changed*/
    private readonly stateEventAtom = atom((get)=>{
        let active = get(this.storyStateAtom)?.activeEventAtom;
        return active && get(active)
    })

    setActiveEvent(event:EventPassage,state:StoryState){
        state.setActiveEvent(event);
        this.storyState = state;
    }

    renderEvent(){
        let event = useAtomValue(this.stateEventAtom)
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

