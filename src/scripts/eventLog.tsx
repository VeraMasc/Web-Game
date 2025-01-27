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
    
    constructor(public text:string,public title:string=""){

    }

    toString():string {
        return "Test"
    }

    toHtml() {
        return <p className="LogEntry"><span className="LogTitle">Test: </span>{this.text}</p>
    }

}