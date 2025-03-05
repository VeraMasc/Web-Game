import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";
import { Character } from "../Entities/character";
import { Room } from "../Entities/room";
import { CustomPassage } from "./storyElement";

/**Presents the Player a choice */
export class Choice extends CustomPassage{
    //TODO: allow options to accept conditional options
    /**The options to display to the player */
    options:string[]=[]

    constructor(...options:string[]){
        super({})
        this.options = options;
    }
    renderPassage(){
        return null
    }
}