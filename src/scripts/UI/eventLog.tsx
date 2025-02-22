import React, {useState,JSX} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom } from "jotai/utils";
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore } from 'jotai';
import { ErrorBoundary } from "./UIutils";

const defaultStore = getDefaultStore()

/**Handles the log history of events */
export class EventLog extends React.Component {
    /**Singleton pattern */
    static get instance():EventLog{
        return EventLog._instance 
    };

    private static _instance:EventLog=null;

    

    /**List of all the entries*/
    entries:PrimitiveAtom<PrimitiveAtom<LogEntry>[]> = atom([atom(new LogEntry("Test"))]);

    /**Jotai store */
    store = createStore()

    
    constructor(props={}){
        super(props)
                console.log(this);
        
        return (EventLog._instance ??=this);
    }


    /**Adds a new entry to the log */
    add = (entry:LogEntry)=>{
        this.store.set(this.entries, (prev)=> [...prev, atom(entry)])
    }

    /**Adds a new simple text/jsx entry*/
    addRaw(text:string|JSX.Element, title?:string){
        this.add(new LogEntry(text, title))
    }
    /**Sets all logs form a list*/
    set(list:LogEntry[]){
        let mapped = list.map(e => atom(e))
        this.store.set(this.entries, (prev)=> [...mapped])
    }
    /**Sets all logs form a list of text/jsx entry */
    setRaw(list:{text:string|JSX.Element, title?:string}[]){
        let mapped = list.map(({text, title})=>new LogEntry(text, title))
        this.set(mapped)
    }

    render() {
        return this.toHtml();
      }

    toHtml=()=>{
        
        //TODO: add keys

        

        // console.log(renderToString(ret));
        return <Provider store={this.store}>
                <ErrorBoundary>
                    <div id="eventLog"><this.RenderLogs list={this.entries}/></div>
                </ErrorBoundary>
            </Provider>
    }

    //TODO: Polish Jotai rendering calls
    RenderLogs({list}:{list:PrimitiveAtom<PrimitiveAtom<LogEntry>[]>}){
        let [value] = useAtom(list);
        return value.map(v =>  <LogEntry.AtomRender logAtom={v} />);
    }
    

}

/**Entry of the log*/
export class LogEntry {
    /**Unique ID of the log */
    logId:string;
    logAtom:PrimitiveAtom<LogEntry> =null;
    

    /**
     * @param content Text of the entry
     * @param title Title of the entry (describes the type of entry)
     */
    constructor(public content:string|JSX.Element, public title:string=""){
        this.logId=crypto.randomUUID();
    }

    toString():string {
        var str:string;
        if(typeof this.content === "string"){
            str = this.content
        }else{
            str = renderToString(this.content);
        }
        return `${this.title}: ${str}`;
    }

    toHtml() {
        console.log(`Re-rendering "${this.content}"`)
        return <ErrorBoundary>
                <p className="LogEntry" key={this.logId}><span className="LogTitle">{this.title}</span>{this.content}</p>
            </ErrorBoundary>    
    }

    toHtmlString():string {
        return renderToString(this.toHtml());
    }

    static AtomRender({logAtom}:{logAtom:PrimitiveAtom<LogEntry>}){
        let [value] = useAtom(logAtom);
        value.logAtom ??= logAtom;
        console.log(value);

        return value?.toHtml()
    }

}