import { JSX } from "react";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";

/**Possible actions that can be taken by the player */
export class Action implements IRenderEl{
    /**HTML text used to describe the action*/
    description:string;

    constructor(desc:string){
        if(!desc?.length)//String is empty
            this.description="Placeholder action";
        else
            this.description=desc;
    }
    
    toHtml(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    toRender(){
        return this.toHtml();
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
    toHtmlString():string {
        return renderToString(this.toHtml());
    }
}