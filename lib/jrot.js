const Data = require('./core/Data');

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

module.exports = JRot;