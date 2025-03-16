import React, { JSX } from "react";
import { LogEntry } from "../../UI/LogEntry";
import { PassageLog } from "../../UI/PassageLog";
import { EventPassage, EventResult } from "../StoryEvents";
import { StoryState } from "../StoryState";
import { StoryArray, StoryFunction } from '../StoryElements';
import { FlowTo } from '../FlowElements/FlowControl';
import { useEffect,createRef } from 'react';



/**Presents the Player a choice */
export class Choice extends EventPassage {
    //TODO: Unique identifiers for options
    /**The options to display to the player */
    options: OptionConfig[];
    /**@param passage Log Passage that prompts the question */
    constructor(public passage?:string|JSX.Element,...options: (string|OptionConfig)[]) {
        super();
        this.options = options.map(o => Choice.getOptionConfig(o));
    }

    renderPassage(state: StoryState): JSX.Element {
        state.awaitingAction = this.options.length>0;//Don't block if no options
        return <span>{this.passage}</span>;
    }

    renderDialog(state: StoryState) {
        return <ul>
            {this.options.map(
                (option, i) => {

                return <RenderChoiceButton key={i} data-value={i} state={state} option={option} parent={this} />}
            )}
        </ul>;
    }

    onRender(state: StoryState): void {
        if(this.options.length==0)
            return; //Don't block if no options
        super.onRender(state); 
        PassageLog.instance.focusElement();
    }

    /**Converts an option value into the {@link OptionConfig} format*/
    static getOptionConfig(value:string|OptionConfig){
        if(typeof value === 'string'){
            value = {text:value}
        }
        return value;
    }
    /**Clones the choice */
    clone(this:Choice):Choice{
        let clone = new Choice();
        clone.options = this.options;
        return clone;
    }
    
    /**Adds an option to the choice and allows chaining
     * @param text text of the option
     * @param config Other parameters of the config
    */
    add(text:string, config:TextlessConfig={}):Choice{
        (config as OptionConfig).text=text;
        this.options.push(config as OptionConfig)
        return this;
    }

    /**Sets the default branch of the choice (replaces unset choice branches) */
    thenDefault(branch:StoryArray):Choice{
        this.options.forEach(op=>op.branch ??=branch)
        return this;
    }
    
    closeEvent(state:StoryState, result:number){
        let ret = super.closeEvent(state,result)
        let branchArray = this.options[result]?.branch;

        if(branchArray != null){
            if(branchArray instanceof FlowTo){
                branchArray.execute(state)
            }
            else if(branchArray){
                state.branchCall(branchArray)
            }
        } 
        return ret;
    }
}

/**Defines how the options of a {@link Choice} are stored*/
export type OptionConfig = {
    /**Text of the choice */
    text:string,
    /**Condition for the choice to be selectable (or false to always lock it)*/
    condition?:((s:StoryState)=>boolean)|boolean,
    /**Branch to jump to if any */
    branch?:StoryArray|StoryFunction|FlowTo
}

/**{@link OptionConfig} without {@link OptionConfig.text}*/
export type TextlessConfig = Omit<OptionConfig,"text">;


/**Props accepted by the option choice component {@link RenderChoiceButton} */
type ChoiceButtonProps = {
    /**Settings for the option button to render */
    option:OptionConfig
    /**Needed for the button to interact with the story */
    state: StoryState;
    /**Event that the button is an option for */
    parent: EventPassage;
    /**Number that identifies this specific choice */
    "data-value"?:number;
};
/**React component to render the each choice */
export function RenderChoiceButton({ option,  state, parent, ...props }: ChoiceButtonProps) {
    let {text, condition} = option;

    /**Uses the value of condition as isBlocked or its result if its a function */
    let isBlocked:boolean = condition ==false
        || (condition instanceof Function && !(condition(state)));
    
    //Get class
    let cls = "choiceButton";
    if (isBlocked)
        cls += " blockedChoice";
    let ref:React.RefObject<HTMLLIElement>;
    //Focus first
    if(props['data-value']==0){
        ref = createRef();
        useEffect(
            ()=>{ref?.current.focus?.()}
        ,[])
    }
    //TODO: Add events to choice options
    //TODO: Find a better way to add events to JSX
    return <li className={cls} ref={ref} tabIndex={0} {...props} onClick={isBlocked ? null : onClickFunction(state, parent)}>{text}</li>;
}
/**Handles the user clicking an Event Option
 * @param state story state to interact with when the player clicks
 * @param source event that created the optionButton
*/
function onClickFunction(state: StoryState, source: EventPassage) {
    return (ev: React.MouseEvent<HTMLElement>) => {
        if (!state.awaitingAction || state.activeEvent != source) //prevent double or wrong calls
            return;

        PassageLog.instance.add(new LogEntry(ev.currentTarget.innerHTML, ">").withClass("playerInput"));
        let result = Number.parseInt(ev.currentTarget.getAttribute("data-value"));
        if(isNaN(result))
            result=null;
        source.closeEvent(state, result);
    };
}
