import React, {useState,JSX} from "react"
import { renderToString } from 'react-dom/server';
import { atom,PrimitiveAtom, useAtom } from "jotai";
import { selectAtom } from "jotai/utils";

/**Handles the log history of events */
export class EventLog extends React.Component {
    /**Singleton pattern */
    static get instance():EventLog{
        return EventLog._instance 
    };

    private static _instance:EventLog=null;

    /**React state of the component */
    state: Readonly<{entries:LogEntry[]}>={
        entries: []
    };

    /**List of all the entries*/
    entries:LogEntry[];


    constructor(props={}){
        super(props)
                console.log(this);
        return (EventLog._instance ??=this);
    }


    /**Adds a new entry to the log */
    add = (entry:LogEntry)=>{
        //Set the new state
        this.setState((prevState:Readonly<any>) => {
            return {entries:[...prevState.entries,entry]}
        }); 
    }

    /**Adds a new simple text/jsx entry*/
    addRaw(text:string|JSX.Element, title?:string){
        this.add(new LogEntry(text, title))
    }

    render() {
        return this.toHtml();
      }

    toHtml() {
        for(let e of this.state.entries){
            console.log(`Entry: ${e}`);
            console.log(renderToString(e.toHtmlString()))
        }
        let ret = this.state.entries.map(e => e.toHtml());
        console.log(renderToString(ret));
        return ret
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

        return <p className="LogEntry" key={this.logId}><span className="LogTitle">{this.title}</span>{this.content}</p>
    }

    toHtmlString():string {
        return renderToString(this.toHtml());
    }

}