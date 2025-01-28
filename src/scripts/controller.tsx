/**Core class that manages all the other game elements */
export class Controller{
    /**Singleton pattern */
    static instance:Controller=null;

    constructor(){
        //Don't create controller if it already exists
        return window['controller']=(Controller.instance ??=this); 
    }
}