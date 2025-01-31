import { Room } from "./house";

/**Encapsulates all elements that exist withtin the game world */
export class BaseEntity{
    /** Name of the entity */
    name:string;

    /**Display color of the entity's name */
    nameColor:string;

    constructor({name, nameColor}:{name:string, nameColor?:string}){
        this.name = name;
        this.nameColor = nameColor
  
    }
}

/**Parameter signature of the base entity */
export type BaseEntityParams= ConstructorParameters<typeof BaseEntity>[0]

/**Entities that occupy locations in the world and can move through it */
export class LocalEntity extends BaseEntity{

    constructor({location, ...args}:{location:Room} & BaseEntityParams){
        super(args)
    }

     
}


/**Parameter signature of local entities */
export type LocalEntityParams= ConstructorParameters<typeof LocalEntity>[0]