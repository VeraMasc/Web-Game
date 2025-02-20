import { House } from "./house";
import { Room } from "./room";
import { IRenderEl } from "../UI/IRenderEl";
import { renderToString } from "react-dom/server";
import { Provider } from "jotai";
import { Character } from './character';
import { JSX } from "react";


/**Parameter signature of the base entity */
export type BaseEntityParams= {name:string, nameColor?:string, icon?:JSX.Element};

/**Encompasses all elements that exist withtin the game world */
export class BaseEntity implements IRenderEl{
    /** Name of the entity */
    name:string;

    /**Display color of the entity's name */
    nameColor?:string;

    /**Icon of the Entity */
    icon?:JSX.Element

    constructor({name, nameColor, icon}:BaseEntityParams|BaseEntity){
        this.nameAs({name,nameColor})
        this.icon = icon;
    }

    /**Clones the current entity */
    clone():this{
        var constructor = this.constructor as EntityConstructor<this>;
        return new constructor(this); 
    }

    /**Renames and/or recolors the entity (use null for no changes) */
    nameAs({name, nameColor}:BaseEntityParams):this{
        this.name = name ?? this.name;
        this.nameColor = nameColor ?? this.nameColor;
        return this;
    }
    toString(): string {
        return this.name;
    }

    toHtml(){
        return <span style={{color:this.nameColor}}>{this.name}</span>
    }

    toRender(key?){
        return this.toHtml();
    }

    toHtmlString():string {
        return renderToString(this.toHtml());
    }
}

/**Base constructor pattern of all entities */
type EntityConstructor<T extends BaseEntity> = {new (arg:T):T}


/**Parameter signature of local entities */
export type LocalEntityParams= {location?:Room, } & BaseEntityParams

/**Entities that occupy locations in the world and can move through it */
export class LocalEntity extends BaseEntity{

    /**Private version of currentLocation */
    private _currentLocation;
    /**Where is the entity currently? */
    get currentLocation():Room {
         return this._currentLocation
    }

    

    constructor({location,  ...args}:LocalEntityParams){
        super(args)
        
        if(location)
            this.jumpTo(location, true);
    }

    
    /**Clones the current localEntity without assigning it to a room */
    clone():this{
        return super.clone(); 
    }
    

     /**Jumps entity to a location regardless of validity or path
      * @param noEvents Moves the entity without triggering location events
     */
    jumpTo(location:Room, noEvents=false){
        //Remove old
        if(this.currentLocation?.removeEntity(this)){
            this._currentLocation = null;
        }
        //Set new
        if(location?.addEntity(this)){
            this._currentLocation = location
        }
        
        if(noEvents)
            return;
        //TODO: Add location change events
    }

    /**Moves entity through the world until it reaches the destination (if possible)*/
    walkTo(location:Room){
        //TODO:Implement pathfinding
    }

    /**Removes the entity from the game entirely */
    destroy(){
        if(this.currentLocation){ //Remove from location
            this.currentLocation.removeEntity(this);
        }
        
    }

    toRender(key?){
        let type = "localRender";
        if(this instanceof Character)
            type+=" characterRender"
        return <Provider key={key}>
            <div className={type}  data-name={this.toString()}>{this.icon}</div>
        </Provider>
    }
}




