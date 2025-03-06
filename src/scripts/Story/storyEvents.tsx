import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";
import { Character } from "../Entities/character";
import { Room } from "../Entities/room";
import { CustomPassage } from "./storyElements";
import { StoryState } from "./storyState";
import React from "react";
import { EventLog } from '../UI/eventLog';
import { Story } from './story';
import { atom, getDefaultStore } from 'jotai';

/**Groups all the passages that have to display stuff in the EventDialogue */
export class EventPassage extends CustomPassage{

    renderDialogue(state:StoryState){
        return <ul>
            <RenderOptionChoice text="Test option 1"/>
            <RenderOptionChoice text="Test option 2" isBlocked/>
            <RenderOptionChoice text="Loooooooooooooooooong Test option 3"/>
        </ul>
    }

    /**Displays event options when the passage is rendered */
    onRender(){
        console.log(this);
        let store = getDefaultStore();
        store.set(EventLog.instance.activeEvent.value,this);

    }
}

/**Presents the Player a choice */
export class Choice extends EventPassage{
    //TODO: allow options to accept conditional options
    /**The options to display to the player */
    options:string[]=[]

    constructor(...options:string[]){
        super()
        this.options = options;
    }
    renderPassage(state:StoryState):JSX.Element{
        state.awaitingAction = true
        console.warn(state);
        return <span >Custom</span>
    }

    
}


/**Props accepted by the option choice component {@link RenderOptionChoice} */
type OptionChoiceProps = {
    /**Text of the option */
    text?:string
    /**Indicates the option appears but can't be chosen */
    isBlocked?:boolean
} 

/**React component to render the each choice */
function RenderOptionChoice({text, isBlocked, ...props}:OptionChoiceProps){
    let cls = "optionChoice";
    if(isBlocked)
        cls += " blockedChoice"
    return <li className={cls} tabIndex={0} onClick={isBlocked?null:onClickOption}>{text}</li>
}

/**Handles the user clicking an Event Option */
function onClickOption(ev: React.MouseEvent<HTMLElement>){
    EventLog.instance.addRaw("Option pressed!")
    
}