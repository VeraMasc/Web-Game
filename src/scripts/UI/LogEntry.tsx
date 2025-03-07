
import React, {useState,JSX, Children, memo} from "react"
import { renderToString } from 'react-dom/server';
import { atom, useAtom, PrimitiveAtom, useSetAtom, useAtomValue, createStore, Provider, getDefaultStore, Atom } from 'jotai';
import { CatchError, convertCssToObject, escapeLogStrings, ExposedTyped, InstantTyped } from './UIutils';
import { ReactTyped, Typed } from "react-typed";
import { PassageElement, CustomPassage, RenderCustomPassage } from '../Story/StoryElements';
import { StoryState } from '../Story/StoryState';
import {PassageLog} from "./PassageLog"

/**Entry of the {@link PassageLog}*/
export class LogEntry {
    
    /**
     * @param content Text of the entry
     * @param title Title of the entry (describes the type of entry)
     * @param titleStyle Css style to insert onto the title
     */
    constructor(public content:string|JSX.Element, public title:string="", public titleStyle:string=""){
        
    }

    toString():string {
        let isString=typeof this.content === "string";
        return `${isString? this.content : renderToString(this.content)}`;
    }

    /**Parses/converts a passage into a log entry */
    static fromPassage(passage:string|CustomPassage, state:StoryState){
        if(passage instanceof CustomPassage){
            return new LogEntry(<RenderCustomPassage passage={passage} state={state}/>)
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
export var LogMemoComponent= memo(function({logAtom}:{logAtom:Atom<LogEntry>}){
    let [value] = useAtom(logAtom); 
    return <RenderLogEntry log={value}/>
})

/**Renders a LogEntry in react */
function RenderLogEntry({log}:{log:LogEntry}){
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

    //TODO: Add option to acutocontinue after a message is finished
    //Passage content
    let contentEl:JSX.Element;
    if(typeof log.content === "string"){ //Typed string
        contentEl = <ReactTyped strings={[log.content]} cursorChar="▌" typeSpeed={20} onBegin={onLogTypingBegin} ></ReactTyped>
    } else{ //Instantly render passage
        contentEl = <InstantTyped children={log.content}  cursorChar="▌" onBegin={onLogTypingBegin} ></InstantTyped>
    }
                
    return <CatchError>
        <div className="LogEntry" >
            {titleEl}
            <CatchError>{contentEl}</CatchError>
        </div>
    </CatchError>  
}


/**Stores the previous log that has started typing */
var previousLog:Typed=null;

/**Close previous log when beginning to write a new one */
function onLogTypingBegin(self:Typed){
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