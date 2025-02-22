import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider } from 'jotai';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { selectAtom,splitAtom  } from "jotai/utils";
import { Controller } from '../controller';
import {TodoList, TestList} from "./jotaiTest"
import {ArrowLeftOutlined} from "@ant-design/icons"
import { Space } from 'antd';

type SetAtomList<T> = ReturnType<typeof useSetAtom<PrimitiveAtom<PrimitiveAtom<T>[]>>>;

//TODO: Cleanup file

/**Renders the action menu */
export class ActionMenu{
    /**List with the options in the menu */
    get optionList(){
        return this.store?.get(this.optListAtom).map( at => this.store.get(at))
    }
    set optionList(value){
        this.store?.set(this.optListAtom, prev =>  this.getOptionAtoms(prev,value))
    }

    /**List of the atoms of the options */
    optListAtom:PrimitiveAtom<PrimitiveAtom<string>[]>= atom([]);

    /**Atom of {@link optPath} */
    optPath:PrimitiveAtom<string>=atom("");

    /**Jotai store */
    store = createStore()

    constructor(){
        this.store.set(this.optPath, "")
        this.store.set(this.optListAtom, this.getOptionAtoms([],[ "Actions", "Stats", "Config"]))
        Controller.instance.menu = this;
    }

   

    getOptionAtoms(prev:PrimitiveAtom<string>[], values:string[]){
        let list = [...prev];
        //Get shortened/elongated list
        list.length = values.length;
        //Fill holes
        for(let i=0; i<list.length; i++){
            list[i] ??= atom(values[i])
            this.store.set(list[i],values[i]) //Register atom
        }
        return list;
    }

    
   

    
    

    toHTML=()=>{        
        //<AllActionButtons atom={this.optListAtom}/>
        return <Provider store={this.store}>
        <PathDescriptor atom={this.optPath}/>
            <TodoList></TodoList>
        </Provider>
    }
}


//TODO: Move Input button creation
/**Creates all the action buttons */
function AllActionButtons({atom}:{atom:PrimitiveAtom<PrimitiveAtom<string>[]>}){
    let [options]=useAtom(atom)//this.store.get(this.optListAtom);
    return options.map( (action,index)=>{
        return <ActionButton atom={action} key={index}/>
    })
}

/**Creates the input button for the menu */
function ActionButton({atom}:{atom:PrimitiveAtom<string>}){
    let [actionUse] = useAtom(atom);
    console.log(`Rerendering Button: ${actionUse}`)
    return <input type="button" className="optionButton" value={actionUse as string}/>
}


function PathDescriptor({atom}:{atom:PrimitiveAtom<string>}){
    let [value] = useAtom(atom);

    return <span id="optionPath">{value} { //Draw return arrow
        value!=""?<Space><ArrowLeftOutlined/></Space>
        :<></>
    }</span>
}