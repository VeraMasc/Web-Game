import { BaseEntity,  LocalEntityParams } from "./Entities/baseEntities";
import { Interactable } from "./Entities/interactable";


/**Items that can be carried or stored by LocalEntities*/
export class Item extends BaseEntity{
    
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

    constructor(item:Item, params:LocalEntityParams){
        if(item==null)
            return null; //Create only if it holds an item
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

