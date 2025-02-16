import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";
import { Character } from "../Entities/character";
import { Room } from "../Entities/room";

/**Describes a specific type of event that can happen in the story */
export class StoryEvent implements IRenderEl{
    
    /**Requirements for the event to trigger */
    conditions:()=>boolean;

    /**Probability (0 to 1) equation for the event to trigger if the conditions are met */
    probability:()=>number|number;

    /**What happens when the Event triggers */
    effects;

    /**Message to print in the log when the event triggers */
    message: (event:StoryEvent,context)=>string;

    toHtml(): JSX.Element {
        throw new Error("Method not implemented.");
    }
    toString(): string {
        throw new Error("Method not implemented.");
    }
    toHTMLString():string {
        return renderToString(this.toHtml());
    }
}

/**Contains the context needed to execute a story event */
export type StoryContext = {
    /**Characters involved on the event */
    characters?:Character[],
    /**Rooms involved on the event */
    locations?:Room[]
    /**Optional extra data */
    extra?:Object
}