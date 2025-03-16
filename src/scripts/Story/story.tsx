import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage, StoryElement, StoryFunction, BranchElement } from './StoryElements';
import { LogEntry } from '../UI/LogEntry';
import {renderToString} from "react-dom/server"
import { StoryState } from './StoryState';
import { state } from 'melonjs';

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
        
        do{     //Branch loop
            //Await for user action
            while(state.awaitingAction){
                yield state;
            }
            var passage = state.nextPassage();
            if(passage == null)
                break;

            Story.playPassage(passage,state)
            
            yield state;
        }while(passage)
            

        console.warn("Story Finished:",state)
        //Yield state forever once the end is reached
        //Allows to see state once finished
        while(true){
            yield state;
        }
    }

    /**Processes the current passage of the {@link play} loop */
    private static playPassage(passage:PassageElement,state:StoryState){
        if(Story.isPassageEl(passage)){
            let entry = LogEntry.fromPassage(passage,state);
            Story.print(entry)
        
        }else {
            console.error(`Can't print invalid passage of type ${(passage as Object)?.constructor?.name}`)
        }
    }

    /**Prints a portion of dialogue and awaits keypress from user */
    static async print(entry:LogEntry){
        Controller.instance.log.add(entry)

        //TODO: improve keypress detection and add mouse
        return new Promise(resolve => {
            window.addEventListener('keypress', resolve, {once:true});
        });
    }

    
    /**Easy way to test the parsing
     * @deprecated
    */
    static parseTest = (str:string)=>LogEntry.parse(str)

    /**Returns if a {@link StoryElement} is {@link PassageElement} */
    static isPassageEl(element:StoryElement):element is PassageElement{
        return typeof element === "string" || element instanceof CustomPassage;
    }

    /**Extracts a {@link StoryArray} from a {@link BranchElement} */
    static extractBranch(source:BranchElement):StoryArray{
        return typeof source === 'function' ? source() : source;
    }
}
