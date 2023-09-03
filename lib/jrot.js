// const DataRange = require('./core/dataRange');
// const Data = require('./core/data');
import DataRange from './core/dataRange.js';
import Data from './core/data.js';

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
     * @returns {string}
     */
    encrypt(str){
        var r = [];
        for(let c of atob(str))
            r.push(this.data.encryptChar(c));
        return r.join("");
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    decrypt(str){
        var r = [];
        for(let c of str)
            r.push(this.data.decryptChar(c));
        return btoa(r.join(""));
    }
}

// module.exports = JRot;
export default JRot;