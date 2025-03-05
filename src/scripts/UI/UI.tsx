import React from "react";
import { EventLog } from './eventLog';
import { CatchError } from "./UIutils";

/**Base game screen component */
export function BaseScreen(){
    //TODO: Improve screen components
    let log = new EventLog();
    //<menu.toHTML/>
    return [
    <log.toHtml/>]
   
}