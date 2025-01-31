import { createRoot } from 'react-dom/client';
import { EventLog } from './eventLog';
import React from 'react';
import { World } from './Entities/world';


/**Core class that manages all the other game elements */
export class Controller{
    /**Singleton pattern */
    static instance:Controller=null;

    /**Gets the event log */
    get log() {return EventLog.instance;}

    constructor(){
        //Don't create controller if it already exists
        return window['controller']=(Controller.instance ??=this); 
    }

    /**Initializes the game and creates an empty World*/
    init(){
        console.log("%c Initializing Game ",'background: #318131;');
        //Create event Log
        let log= document.getElementById("eventLog");
        if(log!=null){
            let root = createRoot(log);
            let entries = React.createElement(EventLog);
            root.render(entries)            
        }

        //TODO: Remove temporary fix
        setTimeout(() => {EventLog.instance.addText("Start")});
        
        //TODO: Add world construction parameters?
        new World();
    }

}