import { useEffect } from "react";
import { CatchError } from "./UIutils";
import { EventLog } from './eventLog';

/**React component to render the player choices */
export function RenderEventOptions(){
    useEffect(()=>console.warn("Options"),[]);
    return <CatchError>
                <div id="eventOptions">
                    <ul>
                        <li className="optionChoice" tabIndex={0} onClick={onClickOption}>Test option 1</li>
                        <li className="optionChoice blockedChoice" tabIndex={0} onClick={onClickOption}>Test option 2</li>
                        <li className="optionChoice" tabIndex={0} onClick={onClickOption}>Loooooooooooooooooong Test option 3</li>
                    </ul>
                </div>
            </CatchError>
}

/**Handles the user clicking an Event Option */
function onClickOption(ev: React.MouseEvent<HTMLElement>){
    console.log(ev)
    EventLog.instance.addRaw("Option pressed!")
    
}