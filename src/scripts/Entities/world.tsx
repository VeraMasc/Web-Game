import { Character } from "./character";
import { House, Room } from "./house";

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
    outsideRooms:Room[]=[new Room({name:"Outside"})];

    constructor(){
        //Don't create controller if it already exists
        return window['world']=(World._instance ??=this);
    }

    /**Procedurally generates the basic elements of the world */
    generate(){
        //TODO:Fully implement world generation

        //TODO:Stop using a premade world

        //Premade world for debug purposes
        this.currentLocation = Object.assign(new House({name:"test"}),{
            rooms:[new Room({name:"Kitchen",type:"Kitchen"})]
        });
        let room=this.currentLocation.rooms[0]
        let char = new Character({name:"TestNPC"})
        char.jumpTo(room);
    }
}