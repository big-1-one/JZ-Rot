


export class Utils {
    static get randomBinary(){
        return Math.random() > .5 ? 0 : 1;
    }

    static between(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}