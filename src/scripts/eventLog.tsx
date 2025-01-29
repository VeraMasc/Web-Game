import React, {useState} from "react"

/**Handles the log history of events */
export class EventLog extends React.Component {
    /**React state of the component */
    state: Readonly<{entries:LogEntry[]}>={
        entries: []
    };

    /**List of all the entries*/
    entries:LogEntry[];

    /**Singleton pattern */
    static instance;

    constructor(props={}){
        super(props)
                console.log(this);
        return (EventLog.instance ??=this);
    }


    /**Adds a new entry to the log */
    add = (entry:LogEntry)=>{
        //Set the new state
        this.setState((prevState:Readonly<any>) => {
            return {entries:[...prevState.entries,entry]}
        }); 
    }

    /**Adds a new simple text entry*/
    addText(text:string){
        this.add(new LogEntry(text))
    }

    render() {
        return this.toHtml();
      }

    toHtml() {
        for(let e of this.state.entries){
            console.log(`Entry: ${e}`);
        }
       
        return this.state.entries.map(e => e.toHtml())
    }

}

/**Entry of the log*/
export class LogEntry {
    /**Unique ID of the log */
    logId;

    /**
     * @param text Text of the entry
     * @param title Title of the entry (describes the type of entry)
     */
    constructor(public text:string,public title:string=""){
        this.logId=crypto.randomUUID();
    }

    toString():string {
        return "Test"
    }

    toHtml() {
        return <p className="LogEntry" key={this.logId}><span className="LogTitle">Test: </span>{this.text}</p>
    }

}