export default {
    get random() { return Math.random() > .5 ? 0 : 1; },
    between(lower, upper) { return Math.floor(lower + Math.random() * (upper - lower + 1)); }
}