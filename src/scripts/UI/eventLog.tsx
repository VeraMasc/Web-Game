import React, {useState,JSX, Children, memo} from "react"
import { renderToString } from 'react-dom/server';
import { selectAtom, splitAtom } from 'jotai/utils';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
import { CatchError, convertCssToObject, escapeLogStrings, ExposedTyped } from './UIutils';
import { ReactTyped, Typed } from "react-typed";
import { RenderEventOptions } from "./eventOptions";
import { PassageElement, CustomPassage } from '../Story/storyElement';

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


//TODO: Put Log Entry in its own file
/**Entry of the log*/
export class LogEntry {
    
    /**
     * @param content Text of the entry
     * @param title Title of the entry (describes the type of entry)
     * @param titleStyle Css style to insert onto the title
     */
    constructor(public content:string, public title:string="", public titleStyle:string=""){
        
    }

    toString():string {
        let isString=typeof this.content === "string";
        return `${isString? this.content : renderToString(this.content)}`;
    }

    /**Parses/converts a passage into a log entry */
    static fromPassage(passage:string|CustomPassage){
        if(passage instanceof CustomPassage){

        }else{ //String passage
            let {content,title,titleStyle} = LogEntry.parse(passage);
            return new LogEntry(content, title,titleStyle);    
        }
    }
    
    /**Pattern to extract the title from story passages 
     * @description the pattern is "[Title]Text" use "[]" to skip the title and "\]" within the title to escape the end title character.
    */
    static readonly titleRegEx = /^\[((?:[^\\\]]|(?:\\[\\\]]?))*?)\]/

    /**Pattern to extract the style after the title */
    static readonly styleRegEx = /^\{([^\}]+)}/

    /**Finds all the escaped end title "]" and "\" characters within a title (once the title has been extracted) */
    static readonly escapeTitleRegEx = /\\([\\\]])/g

    /**Parses a passage and returns its string contents */
    static parse(str:string){
        let content = str;
        let title:string=null;
        let titleStyle:string=null;

        
        //Try to extract title
        let match = content.match(LogEntry.titleRegEx);
        if(match){
            title = match[1].replaceAll(LogEntry.escapeTitleRegEx,"$1")
            content = content.slice(match[0]?.length ?? 0)

            //Try to get the title style
            let style = match[1] && content.match(LogEntry.styleRegEx)
            if(style){
                titleStyle = style[1];
                content = content.slice(style[0]?.length ?? 0)
            }
        }
        
        return {content,title,titleStyle};
    }

}

/**Renders a LogEntry from a memoized atom */
var LogMemoComponent= memo(function({logAtom}:{logAtom:Atom<LogEntry>}){
    let [value] = useAtom(logAtom);  console.log(value);
    return <LogComponent log={value}/>
})

/**Renders a LogEntry in react */
function LogComponent({log}:{log:LogEntry}){
    if(log==null)
        return;
    
    let titleEl = null;
    if(log.title?.length>0) {//Has title
        let style = {}
        try{
            style=convertCssToObject(log.titleStyle??"")
        }catch(err){
            console.error(`Failed to parse LogEntry style: "${log.titleStyle}"`)
        }

        titleEl= <span className="LogTitle" style={style}  dangerouslySetInnerHTML={{__html:log.title}}></span>;
    }
        //TODO: Add a way to disable react typed for some elements
        //TODO: Add option to acutocontinue after a message is finished
    return <CatchError>
        <p className="LogEntry" >
            {titleEl}
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