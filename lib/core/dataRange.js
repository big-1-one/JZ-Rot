/**
 * @typedef {DROV} DROV
 * @typedef {{from: DROV, to: DROV, inc?: number}} DRO
 * @typedef {[from: DROV, to: DROV, inc?: number]} DRA
 */
class DataRange{
    static DefaultSeparator = ",";

    /**
     * @param {number} from 
     * @param {number} to 
     * @param {number} inc 
     */
    constructor(from, to, inc = from < to ? 1:-1){
        if(from > to) throw `(from:${from}) must be less then (to:${to})`;

        /**
         * @type {number}
         */
        this.from = from;
        /**
         * @type {number}
         */
        this.to = to;
        /**
         * @type {number}
         */
        this.inc = inc;
        /**
         * @type {number}
         */
        this.index = 0;
    }

    get length(){
        return Math.ceil((this.to - this.from) / this.inc) + 1;
    }

    get lastIndex(){
        return this.index + (this.length - 1);
    }

    get codes(){
        return this.GetCodes();
    }

    get chars(){
        return this.GetChars();
    }

    /**
     * @type {DRO}
     */
    get AsObject(){
        return {
            from: this.from,
            to:   this.to,
            inc:  this.inc,
        }
    }

    /**
     * @type {DRA}
     */
    get AsArray(){
        return [this.from, this.to, this.inc];
    }

    get AsString(){
        return `${this.from}${DataRange.DefaultSeparator}${this.to}${DataRange.DefaultSeparator}${this.inc}`;
    }

    toString (){
        return this.AsString;
    }


    /**
     * @param {DROV} char
     * @returns {boolean}
     */
    InRange(char){
        if(typeof char === "string")
            char = char.charCodeAt(0);
        if(this.from <= char && char <= this.to)
            return true;
        return false;
    }

    HasIndex(index){
        return (this.index <= index && index <= this.lastIndex)
    }

    /**
     * @param {DROV} char
     * @returns {number|-1}
    */
    GetIndex(char){
        if(typeof char == "string")
            char = char.charCodeAt(0);
        if(!this.InRange(char))
            return -1;
        if(this.from == char)
            return this.index;
        if(this.to == char)
            return this.lastIndex;
        let index = ((char - this.from) / this.inc);
        if(!Number.isInteger(index)) return -1;
        return this.index + index;
    }

    /**
     * @param {number} index
     * @returns {number|-1}
     */
    GetCode(index){
        index = index - this.index;
        let length = this.length - 1;
        if(index == length) return this.to;
        if(index > length) return -1;
        return (this.from + (this.inc * index));
    }
    
    /**
     * @param {number} index
     * @returns {string|undefined}
     */
    GetChar(index){
        var code = this.GetCode(index);
        if(code == -1) return;
        return String.fromCharCode(code);
    }

    /**
     * @param {number[]} arr
     * @returns {number[]}
     */
    GetCodes(arr = []){
        for(let i = 0; i < this.length - 1; i++)
            arr.push(this.from + (i * this.inc));
        arr.push(this.to);
        return arr;
    }

    /**
     * @param {number[]} arr
     * @returns {number[]}
     */
    GetChars(arr = []){
        for(let i = 0; i < this.length - 1; i++)
            arr.push(String.fromCodePoint(this.from + (i * this.inc)));
        arr.push(String.fromCodePoint(this.to));
        return arr;
    }

    /**
     * @param {string} str
     * @returns {DataRange}
     */
    static ParseFromString(str){
        let [from, to, inc = undefined] = str.split(DataRange.DefaultSeparator);
        let nFrom = Number.parseInt(from);
        let nTo = Number.parseInt(to);
        let nInc = typeof inc == "string" ? Number.parseInt(inc): inc;
        return new DataRange(nFrom, nTo, nInc);
    }

    /**
     * @param {DRO} obj
     * @returns {DataRange}
     */
    static ParseFromObject(obj){
        let {from, to, inc = undefined} = obj;
        let nFrom = typeof from == "string" ? Number.parseInt(from): from;
        let nTo = typeof to == "string" ? Number.parseInt(to): to;
        let nInc = typeof inc == "string" ? Number.parseInt(inc): inc;
        return new DataRange(nFrom, nTo, nInc);
    }

    /**
     * @param {DRA} arr
     * @returns {DataRange}
     */
    static ParseFromArray(arr){
        let [from, to, inc = undefined] = arr;
        let nFrom = typeof from == "string" ? Number.parseInt(from): from;
        let nTo = typeof to == "string" ? Number.parseInt(to): to;
        let nInc = typeof inc == "string" ? Number.parseInt(inc): inc;
        return new DataRange(nFrom, nTo, nInc);
    }
}

module.exports = DataRange;