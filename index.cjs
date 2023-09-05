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

class Data{
    static DefaultSeparator = ";";

    /**
     * @param {string} tag
     * @param {number} rc
     */
    constructor(tag, rc = 13){
        /**
         * @type {string}
         */
        this.Tag = tag;
        /**
         * @type {number}
         */
        this.rc = rc;
        /**
         * @type {DataRange[]}
         */
        this.ranges = [];
        if(rc == -1)
            throw "rc can't be 0";
    }

    get lastRange(){
        return this.ranges[this.ranges.length - 1];
    }

    get length(){
        return (this.lastRange?.lastIndex ?? -1) + 1;
    }

    get codes(){
        var codes = [];
        for(let r of this.ranges) r.GetCodes(codes);
        return codes;
    }

    get chars(){
        var chars = [];
        for(let r of this.ranges) r.GetChars(chars);
        return chars;
    }

    /**
     * @param {number} index
     * @returns {boolean}
     */
    HasIndex(index){
        if(this.length == 0) return false;
        return (index < this.length && index >= 0)
    }

    /**
     * @param {number} code
     * @returns {boolean}
     */
    HasCode(code){
        for(let r of this.ranges)
            if(r.GetIndex(code) != -1) return true;
        return false;
    }

    /**
     * @param {number} code
     * @returns {number|-1}
     */
    GetIndex(code){
        for(let r of this.ranges){
            let index = r.GetIndex(code);
            if(index != -1) return index;
        }
        return -1;
    }

    /**
     * @param {number} index
     * @returns {number|-1}
     */
    GetCode(index){
        if(!this.HasIndex(index)) return -1;
        for(let r of this.ranges)
            if(r.HasIndex(index))
                return r.GetCode(index);
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    GetChar(index){
        let code = this.GetCode(index);
        if(code == -1) return;
        return String.fromCharCode(code);
    }

    /**
     * @param {DataRange} range
     */
    AddRange(range){
        for(var r of this.ranges){
            let conflict = r.InRange(range.from) || r.InRange(range.to) || range.InRange(r.from) || range.InRange(r.to);
            if(conflict){
                let rol = r.length < range.length;
                let codes =  rol ? r.codes: range.codes;
                let codes1 =  rol ? range.codes: r.codes;
                for(let c of codes)
                    if(codes1.includes(c))
                        throw `conflict between ranges ${r} , ${range} in ${c}`;
            }
        }
        this.ranges.push(range);
        if(r) range.index = r.lastIndex + 1;
    }

    /**
     * @param {DataRange[]} ranges
     */
    AddRanges(ranges){
        for(let r of ranges) this.AddRange(r);
    }

    /**
     * @param {str} str (ex: 48,97,3)
     */
    AddStringRange(str){
        this.AddRange(DataRange.ParseFromString(str));
    }

    /**
     * @param {DataRange.DRO} obj 
     */
    AddObjectRange(obj){
        this.AddRange(DataRange.ParseFromObject(obj));
    }

    /**
     * @param {DataRange.DRA} arr 
     */
    AddArrayRange(arr){
        this.AddRange(DataRange.ParseFromArray(arr));
    }

    /**
     * @param {number} code
     * @returns {number|-1}
     */
    encryptCode(code){
        let index = this.GetIndex(code);
        if(index == -1) return code;
        index = (index + this.rc) % this.length;
        let code2 = this.GetCode(index);
        return code2 == -1 ? code: code2;
    }

    /**
     * @param {string} char
     * @returns {string}
     */
    encryptChar(char){
        return String.fromCharCode(this.encryptCode(char.charCodeAt(0)));
    }

    /**
     * @param {number} code
     * @returns {number|-1}
     */
    decryptCode(code){
        let index = this.GetIndex(code);
        if(index == -1) return code;
        index = (index - this.rc) % this.length;
        index = index < 0 ? index + this.length: index;
        let code2 = this.GetCode(index);
        return code2 == -1? code: code2;
    }

    /**
     * @param {string} char
     * @returns {string}
     */
    decryptChar(char){
        return String.fromCharCode(this.decryptCode(char.charCodeAt(0)));
    }

    /**
     * @typedef {"string"|"object"|"array"} exportTypes
     * @param {exportTypes} type 
     */
    export(type){
        var methods = {
            string: "AsString",
            object: "AsObject",
            array: "AsArray"
        }
        var ranges = this.ranges.map(r => r[methods[type]]);
        return JSON.stringify({
            tag: this.Tag,
            rc: this.rc,
            ranges,
            type,
        });
    }

    /**
     * @typedef {{tag: string, type: exportTypes, rc: number, ranges: string[]|DataRange.DRO[]|DataRange.DRA[]}} JsonString
     * @param {string} data
     * @returns {Data}
     */
    static import(data){
        /**
         * @type {JsonString}
         */
        var json = JSON.parse(data);
        var data = new Data(json.tag, json.rc);
        var methods = {
            string: "AddStringRange",
            object: "AddObjectRange",
            array: "AddArrayRange"
        }
        for(let r of json.ranges) data[methods[json.type]](r);
        return data;
    }

    /**
     * @param {string} tag
     * @param {number} rc
     * @param  {...DataRange} ranges
     * @returns {Data}
     */
    static Create(tag, rc = 13, ...ranges){
        var data = new Data(tag, rc);
        for(let r of ranges)
            data.AddRange(r);
        return data;
    }
}

class JRot{
    /**
     * @param {Data} data
     */
    constructor(data){
        this.SetData(data);
    }

    /**
     * @param {Data} data
     */
    SetData(data){
        if(!(data instanceof Data))
        throw "data must be instance of Data";
        this.data = data;
    }

    /**
     * @param {string} str
     * @param {boolean} base64
     * @returns {string}
     */
    encrypt(str, base64 = true){
        if(base64) str = btoa(str);
        return Array.from({length: str.length}, (_, i) => this.data.encryptChar(str[i])).join('');
    }

    /**
     * @param {string} str
     * @param {Boolean} base64
     * @returns {string}
     */
    decrypt(str, base64 = true){
        let r = Array.from({length: str.length}, (_, i) => this.data.decryptChar(str[i])).join('');
        return base64 ? atob(r): r;
    }
}

class Tools {
    static get random() { return Math.random() > .5 ? 0 : 1; }
    static between(lower, upper) { return Math.floor(lower + Math.random() * (upper - lower + 1)); }
}

class DataRangeBuilder extends DataRange{
    get index(){
        return 0;
    }
    set index(v){}
    /**
     * @param {boolean} randomize
     * @returns {DataRange[]}
     */
    GetRanges(inc = 1, randomize = true, ranges = []){
        let map = ["push", "unshift"];
        for(let i=0; i < this.lastIndex; i++){
            var r = new DataRange(this.GetCode(i), this.GetCode(i + 1) - 1, inc);
            if(i == this.lastIndex - 1) r.to++;
            ranges[map[randomize?Tools.random:0]](r);
        }
        return ranges;
    }

}

class Rot13 {
    /**
     * @returns {string}
     * @param {string} string
     * @param {boolean} base64
     */
    static encrypt(string, base64 = true){
        return Rot13.run(base64? btoa(string): string);
    }

    /**
     * @returns {string}
     * @param {string} string
     * @param {boolean} base64
     */
    static decrypt(string, base64 = true){
        string = Rot13.run(string);
        return base64? atob(string): string;
    }

    /**
     * @param {string} string
     * @returns {string}
     */
    static run(string){
        return (string).replace(/[a-z]/gi, x => {
            return String.fromCharCode(x.charCodeAt(0) + (x.toLowerCase() <= 'm' ? 13 : -13));
        });
    }
}

module.exports = {
    get DataRange () { return DataRange; },
    get DataRangeBuilder () { return DataRangeBuilder; },

    get Data () { return Data; },

    get JRot () { return JRot; },

    get Rot13 () { return Rot13; },

    get Version () { return "2.0.0"; },
};