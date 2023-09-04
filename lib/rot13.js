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

export {Rot13};