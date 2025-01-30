
/**Describes a specific type of event that can happen in the story */
export class StoryEvent{

    /**Requirements for the event to trigger */
    conditions;

    /**Probability equation for the event to trigger if the conditions are met */
    probability;

    /**What happens when the Event triggers */
    effects;

    /**Message to print in the log when the event triggers */
    message;
}