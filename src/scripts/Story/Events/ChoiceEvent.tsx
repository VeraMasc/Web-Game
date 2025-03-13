import React, { JSX } from "react";
import { LogEntry } from "../../UI/LogEntry";
import { PassageLog } from "../../UI/PassageLog";
import { EventPassage } from "../StoryEvents";
import { StoryState } from "../StoryState";


/**Presents the Player a choice */
export class Choice extends EventPassage {
    //TODO: Better options type to allow options to accept conditional or complex options
    //TODO: Unique identifiers for options
    /**The options to display to the player */
    options: string[] = [];

    constructor(...options: string[]) {
        super();
        this.options = options;
    }

    renderPassage(state: StoryState): JSX.Element {
        state.awaitingAction = true;
        console.warn(state);
        return <span>Custom</span>;
    }

    renderDialogue(state: StoryState) {
        return <ul>
            {this.options.map(
                (choice, i) => <RenderChoiceButton key={i} data-value={i} state={state} text={choice} parent={this} />
            )}
        </ul>;
    }

    onRender(state: StoryState): void {
        super.onRender(state);
        PassageLog.instance.focusElement();
    }
}
/**Props accepted by the option choice component {@link RenderChoiceButton} */
type ChoiceButtonProps = {
    /**Text of the option */
    text?: string;
    /**Indicates the option appears but can't be chosen */
    isBlocked?: boolean;
    /**Needed for the button to interact with the story */
    state: StoryState;
    /**Event that the button is an option for */
    parent: EventPassage;
    /**Number that identifies this specific choice */
    "data-value"?:number;
};
/**React component to render the each choice */
export function RenderChoiceButton({ text, isBlocked, state, parent, ...props }: ChoiceButtonProps) {
    let cls = "choiceButton";
    if (isBlocked)
        cls += " blockedChoice";
    return <li className={cls} tabIndex={0} {...props} onClick={isBlocked ? null : onClickFunction(state, parent)}>{text}</li>;
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
