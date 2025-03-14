import { Controller } from '../controller';
import { StoryArray, PassageElement, CustomPassage } from './StoryElements';
import { LogEntry } from '../UI/LogEntry';
import {renderToString} from "react-dom/server"
import { StoryState } from './StoryState';

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
        do{     //Stack loop
            do{     //Branch loop
                //Await for user action
                while(state.awaitingAction){
                    yield state;
                }
                var passage = state.nextPassage();
                if(passage == null)
                    break;

                if(typeof passage === "string" || passage instanceof CustomPassage){
                    let entry = LogEntry.fromPassage(passage,state);
                    Story.print(entry)
                
                }else {
                    console.error(`Can't print invalid passage of type ${(passage as Object)?.constructor?.name}`)
                }
                
                yield state;
            }while(passage)
            
        }while(state.branchReturn())
        
        console.warn("Story Finished:",state)
        //Yield state forever once the end is reached
        //Allows to see state once finished
        while(true){
            yield state;
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
}
