import { Stage, game, ColorLayer, BitmapText  } from "melonjs";
import { PassageLog } from "../UI/PassageLog";
import {createRoot} from "react-dom/client"
import { Controller } from "../controller";
import React from "react";
import { LogEntry } from "../UI/LogEntry";

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#202020"));

        // add a font text display object
        // @ts-ignore
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font : "PressStart2P",
            size : 4.0,
            textBaseline : "middle",
            textAlign : "center",
            text : "Hello World !"
        }));

        (new Controller()).init();
        
            
        

    }
};

export default PlayScreen;
