import React from "react";
import { PassageLog } from './PassageLog';
import { CatchError } from "./UIutils";

/**Base game screen component */
export function BaseScreen(){
    //TODO: Improve screen components
    let log = new PassageLog();
    //<menu.toHTML/>
    return [
    <log.render/>]
   
}