import { capitalizeFirst } from "../Utils/stringUtils";


/**Handles the in game time of the game world */
export class GameTime{
    /**Index of the moment in the day */
    section:DaySection=0;

    /**Returns the name of the moment in the day */
    get sectionString(){
        return DaySection[this.section];
    }

    /**Which in-game day is it*/
    day:number=1;

    /**Increases the time 
     * @param sectionAmount how many day sections to advance
    */
    increase(sectionAmount:number = 1){
        var num = this.section+ sectionAmount;
        this.section = num % DaySection._length;
        this.day += Math.floor(num / DaySection._length);
        return this;
    }

    /**Skips time until the next instance of the specified part of the day 
     * @param section day section to skip to
     * @param [minAmount=1] forces to skip a minimum amount of time
    */
    skipToTime(section:DaySection, minAmount=1){
        this.increase(minAmount);
        //Get remaining offset
        let diff = (section + DaySection._length) - this.section;
        diff %= DaySection._length;
        this.increase(diff);
        return this;
    }

    /**Conversion of object to string @override*/
    toString(){
        return `${capitalizeFirst(this.sectionString)} of Day ${this.day}`
    }

}

/**Parts of the day */
export enum DaySection{
    morning,
    noon,
    afternoon,
    evening,
    night,
    /**Length of the Section enum */
    _length
}

