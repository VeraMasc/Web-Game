import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";

/**Describes a specific type of event that can happen in the story */
export class StoryEvent implements IRenderEl{
    
    /**Requirements for the event to trigger */
    conditions;

    /**Probability (0 to 1) equation for the event to trigger if the conditions are met */
    probability:()=>number|number;

    /**What happens when the Event triggers */
    effects;

    /**Message to print in the log when the event triggers */
    message;

    toHtml(): JSX.Element {
        throw new Error("Method not implemented.");
    }
    toString(): string {
        throw new Error("Method not implemented.");
    }
}