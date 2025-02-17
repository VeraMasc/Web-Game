import { atom, useAtom, PrimitiveAtom, useSetAtom, } from 'jotai';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { selectAtom,splitAtom  } from "jotai/utils";
import { Controller } from '../controller';
import {TodoList, TestList} from "./jotaiTest"


/**Renders the action menu */
export class ActionMenu{
    //TODO: Finish testing jotai
    optionList:string[]=["Actions","Stats","Config"];
    listAtom= atom<PrimitiveAtom<string>[]>([atom("AAAA")]);
    actionSetAtom:ReturnType<typeof useSetAtom<PrimitiveAtom<PrimitiveAtom<string>[]>>>=null;

   

    static create(){
        //TODO: Prevent side menu from instancing twice
        //Create action menu
        let menu= document.getElementById("sideMenu");
        if(menu!=null){
            let instance = new ActionMenu()
            Controller.instance.menu = instance;
            
            let root = createRoot(menu);
            root.render(React.createElement(instance.toHTML))            
        }
    }

    InputButton({atom,add}){
        let [actionUse] = useAtom(atom);
        return <input type="button" data-atom={atom} onClick={add} className="optionButton" value={actionUse as string}/>
    }

    toHTML=()=>{
        let setList = this.actionSetAtom = useSetAtom(this.listAtom);
        let [splitUse]=useAtom(this.listAtom);
        let add =()=>{
            setList((prev)=>[...prev, atom("aaa")])
        }
        return (
        <> {splitUse.map( action=>{
            
            return <this.InputButton atom={action} add={add}/>
        })}
        </>
        
        )
    }
    
}