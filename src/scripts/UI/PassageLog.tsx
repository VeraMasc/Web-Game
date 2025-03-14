import React, {useState,JSX, Children, memo, createRef} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom, splitAtom } from 'jotai/utils';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
import { CatchError, convertCssToObject, escapeLogStrings, ExposedTyped } from './UIutils';
import { ReactTyped, Typed } from "react-typed";
import { RenderEventDialog,EventDialogUI } from "./EventDialogUi";
import { PassageElement, CustomPassage } from '../Story/StoryElements';
import { LogEntry,LogMemoComponent } from "./LogEntry";
import { StoryState } from "../Story/StoryState";

const defaultStore = getDefaultStore()

/**Acts like a history/display of all rendered story passages*/
export class PassageLog extends React.Component {
    /**Singleton pattern */
    static get instance():PassageLog{
        return PassageLog._instance 
    };

    private static _instance:PassageLog=null;

    /**Ref to the PassageLog element in dom */
    ref=createRef<HTMLDivElement>()


    /**List of all the entries*/
    entries:PrimitiveAtom<LogEntry[]> = atom([]);

    reverseEntries:Atom<LogEntry[]> = atom((get)=>get(this.entries).reverse())

    /**Split atom version of {@link entries} */
    private splitEntries = splitAtom(this.entries);

    /**Story iterator for the story currently playing */
    playing:Generator<StoryState, void, unknown>=null;

    dialog:EventDialogUI= new EventDialogUI();

    
    constructor(props={}){
        super(props)
        
        return (PassageLog._instance ??=this);
    }


    /**Adds a new entry to the log */
    add = (entry:LogEntry)=>{
        defaultStore.set(this.entries, (prev)=> [...prev, entry])
    }

    /**Adds a new simple text/jsx entry*/
    addRaw(text:string, title?:string){
        this.add(new LogEntry(text, title))
    }

    /**Adds the next passage in the current story ({@link playing}) */
    addNext(){
        //TODO: Move to controller?
        this.playing.next();
    }

    /**Sets all logs form a list*/
    set(list:LogEntry[]){
        //TODO: Fix rendering (typing) bugs when setting existing entries
        // let mapped = list.map(e => atom(e))
        defaultStore.set(this.entries, (prev)=> [...list])
    }
    /**Sets all logs form a list of text/jsx entry */
    setRaw(list:{text:string, title?:string}[]){
        let mapped = list.map(({text, title})=>new LogEntry(text, title))
        this.set(mapped)
    }
    /**Clears the entire Log List */
    clear(){
        this.set([])
    }

    /**Sets all logs form a list of text/jsx entry */
    setRawIndex(index:number,text:string, title?:string){
        let entry = new LogEntry(text, title);

        defaultStore.set(this.entries, (prev)=> {
            prev[index] = entry;
            return [...prev];
        })
    }


    
    
    render= ()=> <CatchError>
            <div id="fullLog" ref={this.ref} tabIndex={0} onKeyDown={this.nextPassageEvent.bind(this)} onDoubleClick={this.nextPassageEvent.bind(this)}>
                <div id="eventLogList"><RenderLogsList list={this.splitEntries}/></div>
                <RenderEventDialog event={this.dialog}/>
            </div>
        </CatchError>            

    nextPassageEvent(ev:KeyboardEvent|MouseEvent){
        //TODO: Refactor next passage keybind function
        if ("key" in ev && [" ", "Enter"].includes(ev.key)){
            this.addNext()
        }else if(ev.type ==='dblclick'){
            this.addNext()
        }

    }
    /**Sets focus on the dom element */
    focusElement(){
        PassageLog.instance.ref?.current?.focus()
    }
}

/**Renders a list of logs from an atom list of atoms */
function RenderLogsList({list}:{list:Atom<Atom<LogEntry>[]>}){
    let value = useAtomValue(list);
    //The extra div is necessary for styling reasons. The scrollbar dies otherwise
    return <div>{value.map(v =>  <LogMemoComponent logAtom={v} key={v.toString()} />)}</div>;
}

