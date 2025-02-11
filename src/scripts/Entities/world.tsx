import { Character } from "./character";
import { House } from "./house";
import { Room } from "./Room";
import * as presets from "./Presets/roomPresets";
import preset from "./Presets/presets";
import { baseHouse } from "./Presets/housePresets";



/**Singleton that holds and manages the entities and environment of the game */
export class World{
    /**Singleton pattern */
    static get instance():World{
        return World._instance 
    };

    private static _instance:World=null;

    /**List of all currently generated characters */
    characters:Set<Character>= new Set<Character>()

    /**Place where the player currently is */
    currentLocation:House;

    /**Pseudo Rooms that represent the outside world */
    outsideRooms:Room[]=[presets.outside()];

    constructor(){
        //Don't create controller if it already exists
        return window['world']=(World._instance ??=this);
    }

    /**Procedurally generates the basic elements of the world */
    generate(){
        //TODO:Fully implement world generation

        
        //Premade world for debug purposes
        this.currentLocation = baseHouse()
            .resolveConnections(this.outsideRooms[0]);

        let room=this.currentLocation.rooms[0]
        new Character({name:"TestNPC", location:room})
        new Character({name:"TestNPC 2", location:room})

    }
}