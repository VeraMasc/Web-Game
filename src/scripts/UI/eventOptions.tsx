import { useEffect } from "react";
import { CatchError } from "./UIutils";
import { EventLog } from './eventLog';

/**React component to render the player choices */
export function RenderEventOptions(){
    useEffect(()=>console.warn("Options"),[]);
    return <CatchError>
                <div id="eventOptions">
                    <ul>
                        <RenderOptionChoice text="Test option 1"/>
                        <RenderOptionChoice text="Test option 2" isBlocked/>
                        <RenderOptionChoice text="Loooooooooooooooooong Test option 3"/>
                    </ul>
                </div>
            </CatchError>
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
    console.log(ev)
    EventLog.instance.addRaw("Option pressed!")
    
}