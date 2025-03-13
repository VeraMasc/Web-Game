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
import { RenderChoiceButton } from "./Events/ChoiceEvent";

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
    closeEvent(state:StoryState, result:EventResult){
        state.data.lastEvent=result
        state.setActiveEvent(null);
        //Recover focus after event option is removed
        PassageLog.instance.focusElement()
    }
}

/**Describes all the possible values an event can resturn as a result */
export type EventResult = number;

