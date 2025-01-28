import React from "react"

/**Handles the log history of events */
export class EventLog {
    /**List of all the entries */
    entries:LogEntry[]= [];

    toHtml() {
        return this.entries.map(e => e.toHtml())
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