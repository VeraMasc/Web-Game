import {JSX} from 'react';


/**Indicates that the object can be rendered as HTML*/
export interface IRenderEl{

    toHtml():JSX.Element;
    toString():string;
    toHTMLString():string;
}