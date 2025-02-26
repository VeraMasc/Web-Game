import React, {useState,JSX, Children, memo} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom, splitAtom } from 'jotai/utils';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
import { CatchError, escapeLogStrings, ExposedTyped } from './UIutils';
import { ReactTyped, Typed } from "react-typed";
import { RenderEventOptions } from "./eventOptions";

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

    
    constructor(props={}){
        super(props)
                console.log(this);
        
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

    //TODO: Add way to move optionselection
    //TODO: Add actual option rendering
    toHtml= ()=> <CatchError>
            <div id="fullLog">
                <div id="eventLogList"><RenderLogsList list={this.splitEntries}/></div>
                <RenderEventOptions/>
            </div>
        </CatchError>            

}

/**Renders a list of logs from an atom list of atoms */
function RenderLogsList({list}:{list:Atom<Atom<LogEntry>[]>}){
    let value = useAtomValue(list);
    //The extra div is necessary for styling reasons. The scrollbar dies otherwise
    return <div>{value.map(v =>  <LogMemoComponent logAtom={v} key={v.toString()} />)}</div>;
}

/**Entry of the log*/
export class LogEntry {
    
    /**
     * @param content Text of the entry
     * @param title Title of the entry (describes the type of entry)
     */
    constructor(public content:string, public title:string=""){
        
    }

    toString():string {
        let isString=typeof this.content === "string";
        return `${this.title}: ${isString? this.content : renderToString(this.content)}`;
    }

}

/**Renders a LogEntry from a memoized atom */
var LogMemoComponent= memo(function({logAtom}:{logAtom:Atom<LogEntry>}){
    let [value] = useAtom(logAtom);  console.log(value);
    return <LogComponent log={value}/>
})

/**Renders a LogEntry in react */
function LogComponent({log}:{log:LogEntry}){
    let hasTitle = log.title?.length>0;
        
    return <CatchError>
        <p className="LogEntry" >
            {hasTitle? <span className="LogTitle"  dangerouslySetInnerHTML={{__html:log.title}}></span> :null}
            <ReactTyped strings={[log.content]} cursorChar="▌" typeSpeed={20} onBegin={onLogTypingBegin} ></ReactTyped>
        </p>
    </CatchError>  
}


/**Stores the previous log that has started typing */
var previousLog:Typed=null;

/**Close previous log when beginning to write a new one */
function onLogTypingBegin(self:Typed){
    console.log(self);
    (window as any).typed= self;
    closeLastLog()
    previousLog = self;
}
/**"Closes" the last log */
export function closeLastLog(){
    if (previousLog!=null){
        closeLogTyping(previousLog);
    }
}

/**"Closes" the typing animation */
function closeLogTyping(self:Typed){
    if(self==null)
        return;
    let exposed = self as unknown as ExposedTyped;
    exposed.stop();
    let rawtext = (self as any).strings[0];
    let parsed = escapeLogStrings(rawtext)
    
    // if(self.cursor)
    //     self.cursor.hidden=true;

    if(exposed.el.innerHTML.length != parsed.length)
        exposed.replaceText(parsed)

    //Prevent Typed from changing value after setting it
    exposed.el = document.createElement("div"); 
    exposed.typingComplete=true;
    
}