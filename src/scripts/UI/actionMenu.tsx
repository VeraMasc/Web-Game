import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, } from 'jotai';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { selectAtom,splitAtom  } from "jotai/utils";
import { Controller } from '../controller';
import {TodoList, TestList} from "./jotaiTest"

type SetAtomList<T> = ReturnType<typeof useSetAtom<PrimitiveAtom<PrimitiveAtom<T>[]>>>;

/**Renders the action menu */
export class ActionMenu{
    /**List with the options in the menu */
    optionList:string[]=["Actions","Stats","Config"];

    /**"Path" of the previously chosen options */
    optionsPath="";
    
    /**List of the atoms of the options */
    listAtom:PrimitiveAtom<PrimitiveAtom<string>[]>= null;

    /**Function to set the state of {@link listAtom} */
    private actionSetAtom:SetAtomList<string>=null;

    /**Refreshes the action menu display after making changes */
    refresh(){
        this.actionSetAtom ??= useSetAtom(this.listAtom)
        this.actionSetAtom((prev)=>{
            
            return this.getOptionAtoms(prev) //Changes reference to force reload
        });
    }

    getOptionAtoms(prev:PrimitiveAtom<string>[]){
        let list = [...prev];
        //Get shortened/elongated list
        list.length = this.optionList.length;
        //Fill holes
        for(let i=0; i<list.length; i++){
            list[i] ??= atom(this.optionList[i])
        }
        return list;
    }

    
   

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

    

    toHTML=()=>{
        //Initialize with current value
        this.listAtom ??=atom(this.getOptionAtoms([]));

        let setList = this.actionSetAtom = useSetAtom(this.listAtom);
        let [splitUse]=useAtom(this.listAtom);
        let add =()=>{
            setList((prev)=>[...prev, atom("aaa")])
        }
        return splitUse.map( (action,index)=>{
                return <InputButton atom={action} key={index}/>
        })
    }
}


//TODO: Move Input button creation
function InputButton({atom}){
    let [actionUse] = useAtom(atom);
    return <input type="button" className="optionButton" value={actionUse as string}/>
}