import { createRoot } from 'react-dom/client';
import { EventLog } from './UI/eventLog';
import React from 'react';
import { World } from './World/world';
import { ActionMenu } from './UI/actionMenu';


/**Core class that manages all the other game elements */
export class Controller{
    /**Singleton pattern */
    static get instance():Controller{
        return Controller._instance 
    };

    private static _instance:Controller=null;

    /**Gets the event log */
    get log() {return EventLog.instance;}

    menu:ActionMenu;

    constructor(){
        //Don't create controller if it already exists
        return window['controller']=(Controller._instance ??=this); 
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
        setTimeout(() => {EventLog.instance.addRaw("Start")
            EventLog.instance.addRaw((<span><b>BOLD</b> & <small>small</small></span>))
        });
        
        //Create action menu
        ActionMenu.create()
        
        //Generate world
        new World();
        
        
        setTimeout(() => {World.instance.generate()});
    }

}