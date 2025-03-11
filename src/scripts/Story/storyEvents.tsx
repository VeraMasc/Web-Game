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
import { LogEntry } from '../UI/LogEntry';

/**Groups all the passages that have to display stuff in the EventDialogue */
export class EventPassage extends CustomPassage{


    /**Renders the UI of the event that the User interacts with*/
    renderDialogue(state:StoryState){
        return <ul>
            <RenderChoiceButton state={state} text="Test option 1" parent={this}/>
            <RenderChoiceButton state={state} text="Test option 2" isBlocked parent={this}/>
            <RenderChoiceButton state={state} text="Loooooooooooooooooong Test option 3" parent={this}/>
        </ul>
    }

    /**Displays event options when the passage is rendered */
    onRender(state:StoryState){
        console.log(this);
        PassageLog.instance.dialog.setActiveEvent(this,state)

    }

    /**Ends the event with a result value. Returns false if event already closed*/
    closeEvent(state:StoryState, result:any){

    }
}

/**Presents the Player a choice */
export class Choice extends EventPassage{
    //TODO: Better options type to allow options to accept conditional or complex options
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
            {this.options.map(
                (choice,i)=><RenderChoiceButton state={state} text={choice} parent={this} />
            )}
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
    state:StoryState,
    /**Event that the button is an option for */
    parent:EventPassage
} 

/**React component to render the each choice */
function RenderChoiceButton({text, isBlocked, state, parent, ...props}:ChoiceButtonProps){
    let cls = "choiceButton";
    if(isBlocked)
        cls += " blockedChoice"
    return <li className={cls} tabIndex={0} onClick={isBlocked?null:onClickFunction(state,parent)}>{text}</li>
}

/**Handles the user clicking an Event Option
 * @param state story state to interact with when the player clicks
 * @param source event that created the optionButton
*/
function onClickFunction(state:StoryState,source:EventPassage){
    return (ev: React.MouseEvent<HTMLElement>)=>{
        if(!state.awaitingAction || state.activeEvent!=source)//prevent double or wrong calls
            return;
        
        PassageLog.instance.add(new LogEntry(ev.currentTarget.innerHTML,">").withClass("playerInput"))
        state.setActiveEvent(null);
        //Recover focus after event option is removed
        PassageLog.instance.ref?.current?.focus()
    }
}