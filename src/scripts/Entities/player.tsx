import { BaseEntity } from './baseEntities';

/**Class that controls the player and its interactions */
export class Player extends BaseEntity{
    /**Singleton pattern */
    static get instance():Player{
        return Player._instance 
    };

    private static _instance:Player=null;

    constructor(){
        //TODO: Better player constuctor
        super({name:"Player"})
        //Don't create player if it already exists
        return window['player']=(Player._instance ??=this);
    }

    

    //TODO: Loss conditions
}