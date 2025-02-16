import { Character } from "../Entities/character";
import { House } from "../Entities/house";
import { Room } from "../Entities/room";
import * as presets from "../Entities/Presets/roomPresets";
import preset from "../Entities/Presets/presets";
import { baseHouse } from "../Entities/Presets/housePresets";
import { Player } from '../Entities/player';
import { GameTime } from './time';



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

    /**Current game time */
    time = new GameTime()

    /**Pseudo Rooms that represent the outside world */
    outsideRooms:Room[]=[presets.outside()];

    constructor(){
        //Don't create controller if it already exists
        return window['world']=(World._instance ??=this);
    }

    /**Procedurally generates the basic elements of the world */
    generate(){
        //TODO:Fully implement world generation

        new Player({name:"player"});

        //Premade world for debug purposes
        this.currentLocation = baseHouse()
            .resolveConnections(this.outsideRooms[0]);

        let room=this.currentLocation.rooms[0]
        new Character({name:"TestNPC", location:room})
        new Character({name:"TestNPC 2", location:room})

    }
}