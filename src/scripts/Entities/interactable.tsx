import { Character } from "./character";

/**Elements of the world that can be interacted with*/
export class Interactable{
    /**Who owns (and therefore uses) the object*/
    owners:Character[]=[]
}