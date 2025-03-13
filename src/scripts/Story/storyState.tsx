import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage } from './StoryElements';
import { LogEntry } from '../UI/LogEntry';
import {renderToString} from "react-dom/server"
import { EventPassage } from './StoryEvents';
import { atom, PrimitiveAtom,getDefaultStore } from 'jotai';
import { StoryData } from './StoryData';



/**Keeps track of the story state within the play iterator and identifies a specific execution instance of the story*/
export class StoryState{
    /**Stores an atom of itself for centralized use */
    selfAtom=atom(this);
    /**Current position within the section */
    index:number=-1;

    /**Current story array*/
    activeBranch:StoryArray;

    /**Stored return of the current section function*/
    stack:BranchLocation[]=[];
    
    /**Indicates that the story is paused and waiting for something to happen in {@link activeEvent} */
    awaitingAction:boolean;

    /**Stores all the variables used in the story for conditional executions  */
    data:StoryData=new StoryData();

    /**Current story event that's executing (if any). Set with*/
    get activeEvent():EventPassage{
        return getDefaultStore().get(this.activeEventAtom);
    }
    /**Atom that stores {@link activeEvent} */
    activeEventAtom:PrimitiveAtom<EventPassage>=atom(null as EventPassage);

    /**
     * @param section Story section to play if any
     */
    constructor(section:StoryArray=null){
        this.branchCall(section);
    }

    /**Executes a branch that will return to the previous one once finished 
     * @param branch Branch to execute
     * @param start indext to start from (if any)
    */
    branchCall(branch:StoryArray, start?:number){
        if(this.activeBranch !=null){
            //Save current position
            this.stack.push({branch: this.activeBranch, index: this.index })
        }
        this.activeBranch = branch;
        this.index= start??-1;
    }

    /**Retrieves the next passage in the section */
    nextPassage():PassageElement{
        while((this.index += 1) < this.activeBranch.length){
            //Check if its a passage element
            let passage = this.activeBranch[this.index];
            if(typeof passage === "string" || passage instanceof CustomPassage)
                return passage;

            //If not a passage, Try next element
            //TODO: If no passage, pop call stack
        }
        console.warn("End of section reached")
        return null; //TODO: Exit passage nesting
    }

    /**Sets the currently active event and waits for it to resolve (if not null)*/
    setActiveEvent(event:EventPassage){
        getDefaultStore().set(this.activeEventAtom,event);
        this.awaitingAction= event!=null;
    }

}

/**References a specific point in a story branch */
export type BranchLocation = {branch:StoryArray, index:number}

