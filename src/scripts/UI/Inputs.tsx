/** Defines tools to handle user inputs
 * @module
 */

import React, { ReactEventHandler, SyntheticEvent } from "react";

/**Alias of functions that can be used in keyboard events */
type KeyHandler<T> = React.KeyboardEventHandler<T>;

/**Filters all events that don't have the expected keys */
export function filterEventKeys<T extends HTMLElement>(keys:string[], callback: KeyHandler<T>):KeyHandler<T>{
    return (ev:React.KeyboardEvent<T>)=>{
        if (keys.includes(ev?.key))
            return callback?.(ev)
    }
}

type CallbackGenerator=(...args:any)=>ReactEventHandler<HTMLElement>;

/**Allows you to chain event calls of a specific type */
export class EventQuery<T extends CallbackGenerator>{
    callbacks:ReactEventHandler[]=[]
    basis:T

    constructor(func:T){
        this.basis = func
    }

    /**Adds an event to the event chain */
    add(...args:Parameters<T>){
        let call = this.basis(...args)
        this.callbacks.push(call)
        return this;
    }

    addLambda(func:(ev:SyntheticEvent<any>)=>any){
        this.callbacks.push(func)
    }

    hybridChain<W extends CallbackGenerator>(func:W){
        let newQuery =  new EventQuery<W>(func);
        newQuery.addLambda(this.asCallback())
        return newQuery
    }

    asCallback(){
        return (ev:SyntheticEvent)=> {this.callbacks.forEach(f => f?.(ev))}
    }
}

/**Chains several event callbacks */
export function chainEvents<T>( ...callbacks: ReactEventHandler<T>[]):ReactEventHandler<T>{
    return (ev)=> callbacks.forEach(f => f?.(ev))
}