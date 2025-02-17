import { atom, useAtom, PrimitiveAtom, useSetAtom, } from 'jotai';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { selectAtom,splitAtom  } from "jotai/utils";
import { Controller } from '../controller';


/**Renders the action menu */
export class ActionMenu{
    //TODO: Finish testing jotai
    optionList:string[]=["Actions","Stats","Config"];
    actionAtom:PrimitiveAtom<string[]>= null;
    actionSetAtom:ReturnType<typeof useSetAtom<PrimitiveAtom<string[]>>>=null;

   

    static create(){
        //TODO: Prevent side menu from instancing twice
        //Create action menu
        let menu= document.getElementById("sideMenu");
        if(menu!=null){
            let instance = new ActionMenu()
            Controller.instance.menu = instance;
            instance.actionAtom = atom(instance.optionList);
            
            let root = createRoot(menu);
            root.render(React.createElement(instance.toHTML))            
        }
    }

    toHTML=()=>{
        [,this.actionSetAtom] = useAtom(this.actionAtom);
        let select = splitAtom(this.actionAtom) //TODO: Causes error when entry is removed
        let [splitUse]=useAtom(select);
        return (
        <> {splitUse.map( action=>{
            let [actionUse] = useAtom(action);
            return <input type="button" data-atom={action} className="optionButton" value={actionUse}/>
        })}</>
        )
    }

    
}