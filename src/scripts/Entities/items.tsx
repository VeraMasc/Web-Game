import { BaseEntity,  LocalEntityParams } from "./baseEntities";
import { Interactable } from "./interactable";


/**Items that can be carried or stored by LocalEntities*/
export class Item extends BaseEntity{
    
    /**Returns the Item as content of an {@link ItemHolder} */
    asHolder(){
        return new ItemHolder(this,this) //Creates a holder version of the item
    }
}

/**Local Entity whose only purpose is to hold dropped item*/
export class ItemHolder extends Interactable{
    /**Item to hold */
    private _item:Item;
    /**Item to hold (Getter)*/
    get item():Item{
        return this._item;
    }

    //Create from item overload
    constructor(item:Item, params:LocalEntityParams);
    //Clone overload 
    constructor(item:ItemHolder);
    constructor(item:Item|ItemHolder, params?:LocalEntityParams){
        if(item == null)
            return;
        //Extract from holder
        if(item instanceof ItemHolder){
            params = item;
            item = item.item;
        }
        //Create from item
        super(params)
        this._item = item;
    }


    

    /**Gets the item and destroys the holder */
    extractItem(){
        let ret = this._item;
        this._item = null; //Set to null before destroying
        this.destroy();
        return ret;
    }
}

