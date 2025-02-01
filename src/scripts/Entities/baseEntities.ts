import { House, Room } from "./house";


/**Parameter signature of the base entity */
export type BaseEntityParams= {name:string, nameColor?:string};

/**Encapsulates all elements that exist withtin the game world */
export class BaseEntity{
    /** Name of the entity */
    name:string;

    /**Display color of the entity's name */
    nameColor:string;

    constructor({name, nameColor}:BaseEntityParams){
        this.name = name;
        this.nameColor = nameColor
  
    }
}




/**Parameter signature of local entities */
export type LocalEntityParams= {location?:Room} & BaseEntityParams

/**Entities that occupy locations in the world and can move through it */
export class LocalEntity extends BaseEntity{

    /**Private version of currentLocation */
    private _currentLocation;
    /**Where is the entity currently? */
    get currentLocation():Room {
         return this._currentLocation
    }

    constructor({location, ...args}:{location:Room} & BaseEntityParams){
        super(args)
        if(location)
            this.jumpTo(location);
    }

     /**Jumps entity to a location regardless of validity or path*/
    jumpTo(location:Room){
        //Remove old
        if(this.currentLocation?.removeEntity(this)){
            this._currentLocation = null;
        }
        //Set new
        if(location?.addEntity(this)){
            this._currentLocation = location
        }
        //TODO: Add location change events
    }

    /**Moves entity through the world until it reaches the destination (if possible)*/
    walkTo(location:Room){
        //TODO:Implement pathfinding
    }
}


