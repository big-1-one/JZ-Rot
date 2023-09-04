// module.exports = {
//     get DataRange () { return require('./lib/core/dataRange') },
//     get Data () { return require('./lib/core/data') },
//     get JRot () { return require('./lib/jrot') }
// }
import DataRange from './lib/core/dataRange.js';
import Data from './lib/core/data.js';
import JRot from './lib/jrot.js';
import DataRangeBuilder from './lib/DataRangeBuilder.js';
import { Rot13 } from './lib/rot13.js';

export {DataRange, Data, JRot, DataRangeBuilder, Rot13};