import React, {useState,JSX, Children, memo} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom, splitAtom } from 'jotai/utils';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
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
    entries:PrimitiveAtom<LogEntry[]> = atom([new LogEntry("Test")]);
    splitEntries = splitAtom(this.entries);

    /**Jotai store */
    store = createStore()

    
    constructor(props={}){
        super(props)
                console.log(this);
        
        return (EventLog._instance ??=this);
    }


    /**Adds a new entry to the log */
    add = (entry:LogEntry)=>{
        this.store.set(this.entries, (prev)=> [...prev, entry])
    }

    /**Adds a new simple text/jsx entry*/
    addRaw(text:string|JSX.Element, title?:string){
        this.add(new LogEntry(text, title))
    }
    /**Sets all logs form a list*/
    set(list:LogEntry[]){
        // let mapped = list.map(e => atom(e))
        this.store.set(this.entries, (prev)=> [...list])
    }
    /**Sets all logs form a list of text/jsx entry */
    setRaw(list:{text:string|JSX.Element, title?:string}[]){
        let mapped = list.map(({text, title})=>new LogEntry(text, title))
        this.set(mapped)
    }

    /**Sets all logs form a list of text/jsx entry */
    setRawIndex(index:number,text:string|JSX.Element, title?:string){
        let entry = new LogEntry(text, title);

        this.store.set(this.entries, (prev)=> {
            prev[index] = entry;
            return [...prev];
        })
    }

    render() {
        return this.toHtml();
      }

    toHtml=()=>{
        
        


        // console.log(renderToString(ret));
        return <Provider store={this.store}>
                <ErrorBoundary>
                    <div id="eventLog"><EventLog.RenderLogsWrap list={this.splitEntries}/></div>
                </ErrorBoundary>
            </Provider>
    }

    //TODO: Polish Jotai rendering calls
    static RenderLogs({ children}:{children:Atom<LogEntry>[]}){
        console.log(children.map(v => v.toString()));
        return children.map(v =>  <LogEntry.AtomRender logAtom={v} key={v.toString()} />);
    }

    static RenderLogsWrap({list}:{list:Atom<Atom<LogEntry>[]>}){
        let value = useAtomValue(list);
        return <EventLog.RenderLogs children={value}/>
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
                <p className="LogEntry" ><span className="LogTitle">{this.title}</span>{this.content}</p>
            </ErrorBoundary>    
    }

    toHtmlString():string {
        return renderToString(this.toHtml());
    }

    static AtomRender= memo(function({logAtom}:{logAtom:Atom<LogEntry>}){
        let [value] = useAtom(logAtom);
        
        console.log(value);

        return <LogEntry.AtomRenderInner entry={value}/>
    })

    static AtomRenderInner = function({entry}:{entry:LogEntry}){
        
        return entry?.toHtml()
    }

}