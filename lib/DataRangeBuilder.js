const DataRange = require('./core/DataRange');
const Tools = require('./tools');

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

module.exports = DataRangeBuilder;