class Tools {
    static get random() { return Math.random() > .5 ? 0 : 1; }
    static between(lower, upper) { return Math.floor(lower + Math.random() * (upper - lower + 1)); }
}

module.exports = Tools;