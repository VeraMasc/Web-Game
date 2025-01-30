import { createRoot } from 'react-dom/client';
import { EventLog } from './eventLog';
import React from 'react';

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

    /**Initializes the game and its world */
    init(){
        console.warn("Initializing Game")
        //Create event Log
        let log= document.getElementById("eventLog");
        if(log!=null){
            let root = createRoot(log);
            let entries = React.createElement(EventLog);
            root.render(entries)            
        }
        EventLog.instance.addText("Start")
    }
}