import { createRoot } from 'react-dom/client';
import { EventLog } from './UI/eventLog';
import React from 'react';
import { World } from './World/world';
import { ActionMenu } from './UI/actionMenu';
import { RenderWorld } from './UI/woldMap';
import { BaseScreen } from './UI/UI';
import { getDefaultStore } from 'jotai';
import { Story } from './Story/story';
import { testSegment } from './Story/Text/testText';


/**Core class that manages all the other game elements */
export class Controller{
    /**Singleton pattern */
    static get instance():Controller{
        return Controller._instance 
    };

    private static _instance:Controller=null;

    /**Gets the event log */
    get log() {return EventLog.instance;}

    /**Retrieves the default jotai store. Use only for debugging */
    get defaultStore(){return getDefaultStore()}

    menu:ActionMenu;

    constructor(){
        //Don't create controller if it already exists
        return window['controller']=(Controller._instance ??=this); 
    }

    /**Initializes the game and creates an empty World*/
    init(){
        console.log("%c Initializing Game ",'background: #318131;');

        // //Create event Log
        let screen= document.getElementById("screenContainer");
        if(screen!=null){
            let root = createRoot(screen);
            let entries = React.createElement(BaseScreen);
            root.render(entries);            
        }
        
        let story = new Story();

        // TODO: Remove temporary fix 
        setTimeout(() => {
            //story.section();
            window['play'] = story.play(testSegment())
        },200);
        
        // //Create action menu
        // ActionMenu.create()
        
        
        
    }

}