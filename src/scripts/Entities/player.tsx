import { BaseEntity } from './baseEntities';

/**Class that controls the player and its interactions */
export class Player extends BaseEntity{
    /**Singleton pattern */
    static get instance():Player{
        return Player._instance 
    };

    private static _instance:Player=null;

    //TODO: Better player constuctor

    //TODO: Loss conditions
}