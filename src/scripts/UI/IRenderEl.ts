import {JSX} from 'react';


/**Indicates that the object can be rendered as HTML*/
export interface IRenderEl{

    /**Renders the element in the game world */
    toRender():JSX.Element
    /**Displays the element as text */
    toHtml():JSX.Element;
    toString():string;
    toHtmlString():string;
}