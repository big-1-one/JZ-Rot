// const DataRange = require('./dataRange');
import DataRange from './dataRange.js';

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

// module.exports = Data;
export default Data;