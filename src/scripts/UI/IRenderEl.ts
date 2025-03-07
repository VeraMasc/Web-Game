import {JSX} from 'react';


/**Indicates that the object can be rendered as HTML*/
export interface IRenderEl{
    //TODO: Remove entirely?
    /**Renders the element in the game world 
     * @param key Provide element key if rendering elements in bulk
    */
    toRender(key?:number|string):JSX.Element
    /**Displays the element as text */
    toHtml():JSX.Element;
    toString():string;
    toHtmlString():string;
}