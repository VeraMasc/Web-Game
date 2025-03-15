import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage, ExecElement, StoryElement, NonPassageElement } from './StoryElements';
import { LogEntry } from '../UI/LogEntry';
import {renderToString} from "react-dom/server"
import { EventPassage } from './StoryEvents';
import { atom, PrimitiveAtom,getDefaultStore } from 'jotai';
import { StoryData } from './StoryData';
import { Story } from './Story';



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
        //TODO: Unify calls the storyFunctions and FunctionArrays
        if(this.activeBranch !=null){
            //Save current position
            this.stack.push({branch: this.activeBranch, index: this.index })
        }
        this.branchSet(branch, start);
    }

    /**Returns to where it was called if possible.*/
    branchReturn():boolean{
        if(!this.stack.length)
            return false;
        let {branch,index} = this.stack.pop();
        if((branch??index)!=null){
            this.branchSet(branch,index)
            return true;
        }
        return false;
    }

    /**Moves to a branch position (won't return once finished) 
     * @param branch Branch to execute
     * @param start indext to start from (if any)
    */
    branchJump(branch:StoryArray, start?:number){
        //TODO: Unify calls the storyFunctions and FunctionArrays
        this.stack.length=0;
        this.branchSet(branch,start)
    }

    /**Moves to a branch position without changing the stack (DANGEROUS)
     * @param branch Branch to execute
     * @param start indext to start from (if any)
    */
    private branchSet(branch:StoryArray, start?:number){
        this.activeBranch = branch;
        this.index= start??-1;
    }

    /**Retrieves the next passage in the section and executes all elements in the path */
    nextPassage():PassageElement{
        do{//Stack loop
            while((this.index += 1) < this.activeBranch.length){ //Iterate until passage is found
                let element = this.activeBranch[this.index];
                
                if(Story.isPassageEl(element)) 
                    return element;
                this.executeStoryEl(element)
            }
        }while(this.branchReturn())
            
        console.warn("End of section reached")
        return null;
    }

    /**Executes a {@link NonPassageElement} if possible*/
    private executeStoryEl(element:NonPassageElement){
        if(element instanceof ExecElement){ //Executable Elements
            element.execute(this);
        }else{
            //Branch types or other
            if(element instanceof Function) element=element() //Extract Branch from function
            
            if(element instanceof Array){ //Branch array
                this.branchCall(element)
            } 
        }
    }

    /**Sets the currently active event and waits for it to resolve (if not null)*/
    setActiveEvent(event:EventPassage){
        getDefaultStore().set(this.activeEventAtom,event);
        this.awaitingAction= event!=null;
    }

}

/**References a specific point in a story branch */
export type BranchLocation = {branch:StoryArray, index:number}

