import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage } from './storyElement';

/**It handles all the story progression and logic */
export class Story{
    /**Singleton pattern */
    static get instance():Story{
        return Story._instance 
    };
    private static _instance:Story=null;

    /**Current Position inside the current story array*/
    index:number=-1;

    /**Current story array*/
    branch:StoryArray;

    /**Stored return of the current section function*/
    stack:StoryArray[];

    /**Last call to print */
    lastPrint:Promise<void>;

    //TODO: Remove
    section:()=>Promise<void>= async ()=>{
        Controller.instance.log.clear();
        await this.print("Initializing^1000.^1000.^1000.","<span style=\"color:dodgerblue;\">System:</span>")
        await this.print("System compromised!^1000 Initiating damage recovery","<span style=\"color:dodgerblue;\">System:</span>")
    }

    constructor(){
        //Don't create controller if it already exists
        return window['story']=(Story._instance ??=this); 
    }

    /**Retrieves the next passage in the section */
    nextPassage():PassageElement{
        while((this.index += 1) < this.branch.length){
            //Check if its a passage element
            let passage = this.branch[this.index];
            if(typeof passage === "string" || passage instanceof CustomPassage)
                return passage;

            //If not a passage, Try next element
        }
        console.warn("End of section reached")
        return null; //TODO: Exit passage nesting
    }

    /**Displays the next passage */
    printNext(){

        //TODO: implement as iterator
        let passage = this.nextPassage();
        if(passage == null)
            return;
        this.print(passage as string)
        .then(()=>this.printNext())
    }

    /**Executes the story as an iterator*/
    *play(section:StoryArray){
        //TODO: Iterator returns current story state
        this.index =-1; //Reset index
        let state = new StoryState();
        do{
            var passage = this.nextPassage();
            if(passage == null)
                break;
            this.print(passage as string)
            yield state;
        }while(passage )
        
    }

    /**Prints a portion of dialogue and awaits keypress from user */
    async print(text:string, title:string=null){
        //TODO: make more flexible
        Controller.instance.log.addRaw(text,title)

        //TODO: improve keypress detection and add mouse
        return new Promise(resolve => {
            window.addEventListener('keypress', resolve, {once:true});
        });
    }
}

/**Keeps track of the story state within the play iterator */
export class StoryState{
    /**Current position within the section */
    index:number=-1;

    /**Current story array*/
    activeBranch:StoryArray;

    /**Stored return of the current section function*/
    stack:BranchLocation[]=[];

    /**
     * 
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
}

/**References a specific point in a story branch */
export type BranchLocation = {branch:StoryArray, index:number}