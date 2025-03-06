import React, {useState,JSX, Children, memo} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom, splitAtom } from 'jotai/utils';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
import { CatchError, convertCssToObject, escapeLogStrings, ExposedTyped } from './UIutils';
import { ReactTyped, Typed } from "react-typed";
import { RenderEventDialogue,EventDialogue } from "./eventOptions";
import { PassageElement, CustomPassage } from '../Story/storyElements';
import { LogEntry,LogMemoComponent } from "./LogEntry";
import { StoryState } from "../Story/storyState";

const defaultStore = getDefaultStore()

/**Handles the log history of events */
export class EventLog extends React.Component {
    /**Singleton pattern */
    static get instance():EventLog{
        return EventLog._instance 
    };

    private static _instance:EventLog=null;


    /**List of all the entries*/
    entries:PrimitiveAtom<LogEntry[]> = atom([]);

    reverseEntries:Atom<LogEntry[]> = atom((get)=>get(this.entries).reverse())

    /**Split atom version of {@link entries} */
    private splitEntries = splitAtom(this.entries);

    /**Story iterator for the story currently playing */
    playing:Generator<StoryState, void, unknown>=null;

    activeEvent:EventDialogue= new EventDialogue();

    
    constructor(props={}){
        super(props)
        
        return (EventLog._instance ??=this);
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

    render() {
        return this.toHtml();
    }

    
    
    toHtml= ()=> <CatchError>
            <div id="fullLog" tabIndex={0} onKeyDown={this.nextPassageEvent.bind(this)}>
                <div id="eventLogList"><RenderLogsList list={this.splitEntries}/></div>
                <RenderEventDialogue event={this.activeEvent}/>
            </div>
        </CatchError>            

    nextPassageEvent(ev:KeyboardEvent){
        if ([" ", "Enter"].includes(ev.key)){
            this.addNext()
        }

    }
}

/**Renders a list of logs from an atom list of atoms */
function RenderLogsList({list}:{list:Atom<Atom<LogEntry>[]>}){
    let value = useAtomValue(list);
    //The extra div is necessary for styling reasons. The scrollbar dies otherwise
    return <div>{value.map(v =>  <LogMemoComponent logAtom={v} key={v.toString()} />)}</div>;
}

