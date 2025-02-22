import React from "react";
import { ActionMenu } from './actionMenu';

/**Base game screen component */
export function BaseScreen(){
    //TODO: Improve screen components
    let menu = new ActionMenu();
    return [<div id="sideMenu">
        <menu.toHTML/>
    </div>,
    <div id="eventLog"></div>]
}