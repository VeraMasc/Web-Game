import { Stage, game, ColorLayer, BitmapText  } from "melonjs";
import { EventLog, LogEntry } from "../eventLog";
import {createRoot} from "react-dom/client"


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

        let log= document.getElementById("eventLog");
        if(log!=null){
            let root = createRoot(log);
            let entries = new EventLog();
            for(let i=0;i<4;i++){
                entries.entries.push(new LogEntry(`Entry ${i}`))
            }
            
            
            root.render(entries.toHtml())
        }
            
        

    }
};

export default PlayScreen;
