module.exports = {
    get DataRange () { return require('./lib/core/DataRange') },
    get DataRangeBuilder () { return require('./lib/DataRangeBuilder') },

    get Data () { return require('./lib/core/Data') },

    get JRot () { return require('./lib/Jrot') },

    get Rot13 () { return require('./lib/Rot13') },

    get Version () { return "2.0.0"; },
};