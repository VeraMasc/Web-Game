import { Controller } from '../controller';

/**It handles all the story progression and logic */
export class Story{
    /**Singleton pattern */
    static get instance():Story{
        return Story._instance 
    };
    private static _instance:Story=null;

    /**Current story section, defined as a lambda function */
    section:()=>Promise<void>= async ()=>{
        Controller.instance.log.clear();
        await this.print("Initializing^1000.^1000.^1000.","<span style=\"color:dodgerblue;\">System:</span>")
        await this.print("System compromised!^1000 Initiating damage recovery","<span style=\"color:dodgerblue;\">System:</span>")
    }

    constructor(){
        //Don't create controller if it already exists
        return window['story']=(Story._instance ??=this); 
    }

    /**Prints a portion of dialogue and awaits keypress from user */
    async print(text:string, title:string){
        //TODO: make more flexible
        Controller.instance.log.addRaw(text,title)

        //TODO: improve keypress detection and add mouse
        return new Promise(resolve => {
            window.addEventListener('keypress', resolve, {once:true});
        });
    }
}