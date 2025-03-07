import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";
import { Character } from "../Entities/character";
import { Room } from "../Entities/room";
import { CustomPassage } from "./StoryElements";
import { StoryState } from "./StoryState";
import React from "react";
import { PassageLog } from '../UI/PassageLog';
import { Story } from './Story';
import { atom, getDefaultStore } from 'jotai';
import { state } from 'melonjs';

/**Groups all the passages that have to display stuff in the EventDialogue */
export class EventPassage extends CustomPassage{

    /**Renders the UI of the event that the User interacts with*/
    renderDialogue(state:StoryState){
        return <ul>
            <RenderChoiceButton state={state} text="Test option 1"/>
            <RenderChoiceButton state={state} text="Test option 2" isBlocked/>
            <RenderChoiceButton state={state} text="Loooooooooooooooooong Test option 3"/>
        </ul>
    }

    /**Displays event options when the passage is rendered */
    onRender(state:StoryState){
        console.log(this);
        PassageLog.instance.activeEvent.setActiveEvent(this,state)

    }
}

/**Presents the Player a choice */
export class Choice extends EventPassage{
    //TODO: allow options to accept conditional or complex options
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

    renderDialogue(state:StoryState){
        return <ul>
            {this.options.map((choice,i)=><RenderChoiceButton state={state} text={choice} />)}
        </ul>
    }
    
}


/**Props accepted by the option choice component {@link RenderChoiceButton} */
type ChoiceButtonProps = {
    /**Text of the option */
    text?:string
    /**Indicates the option appears but can't be chosen */
    isBlocked?:boolean
    /**Needed for the button to interact with the story */
    state:StoryState
} 

/**React component to render the each choice */
function RenderChoiceButton({text, isBlocked, state, ...props}:ChoiceButtonProps){
    let cls = "optionChoice";
    if(isBlocked)
        cls += " blockedChoice"
    return <li className={cls} tabIndex={0} onClick={isBlocked?null:onClickFunction(state)}>{text}</li>
}

/**Handles the user clicking an Event Option
 * @param state story state to interact with when the player clicks
*/
function onClickFunction(state:StoryState){
    return (ev: React.MouseEvent<HTMLElement>)=>{
        PassageLog.instance.addRaw("Option pressed!")
        state.awaitingAction=false;
    }
}