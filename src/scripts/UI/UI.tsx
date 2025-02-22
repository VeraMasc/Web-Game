import React from "react";
import { ActionMenu } from './actionMenu';
import { EventLog } from './eventLog';
import { ErrorBoundary } from "./UIutils";

/**Base game screen component */
export function BaseScreen(){
    //TODO: Improve screen components
    let menu = new ActionMenu();
    let log = new EventLog();
    return [<div id="sideMenu">
        <menu.toHTML/>
    </div>,
    <ErrorBoundary>
        <log.toHtml/>
    </ErrorBoundary>]
}