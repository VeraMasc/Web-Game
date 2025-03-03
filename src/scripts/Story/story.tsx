import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage } from './storyElement';
import { LogEntry } from '../UI/eventLog';

/**It handles all the story progression and logic */
export class Story{
    /**Singleton pattern */
    static get instance():Story{
        return Story._instance 
    };
    private static _instance:Story=null;




    constructor(){
        //Don't create controller if it already exists
        return window['story']=(Story._instance ??=this); 
    }

    

    

    /**Executes the story as an iterator*/
    *play(section:StoryArray){
        
        let state = new StoryState(section);
        do{
            var passage = state.nextPassage();
            if(passage == null)
                break;

            if(typeof passage === "string"){
                let parsed = LogEntry.parse(passage);
                console.log(parsed)
                Story.print(parsed.content, parsed.title)
            }else{
                //TODO: Implement print non strings
                console.error("Pinting non string StoryElements not implemented")
            }
            
            yield state;
        }while(passage)
        
    }

    /**Prints a portion of dialogue and awaits keypress from user */
    static async print(text:string, title:string=null){
        //TODO: make more flexible
        Controller.instance.log.addRaw(text,title)

        //TODO: improve keypress detection and add mouse
        return new Promise(resolve => {
            window.addEventListener('keypress', resolve, {once:true});
        });
    }

    
    /**Easy way to test the parsing
     * @deprecated
    */
    static parseTest = (str:string)=>LogEntry.parse(str)
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

    /**Displays the next passage */
    printNext(){

        //TODO: implement as iterator
        let passage = this.nextPassage();
        if(passage == null)
            return;
        Story.print(passage as string)
        .then(()=>this.printNext())
    }
}

/**References a specific point in a story branch */
export type BranchLocation = {branch:StoryArray, index:number}