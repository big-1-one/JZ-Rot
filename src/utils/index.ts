type char<T extends string> = T extends `${infer F}${infer R}`
    ? R extends ""
        ? F
        : never
    : never;

export class Utils {
    static get random(){
        return Math.random() > .5 ? 0 : 1;
    }

    static parse<T extends string>(arg: number | `${number}` | string | char<T>): number {
        return typeof arg === "string"
            ? arg.length == 1
                ? arg.charCodeAt(0)
                : parseInt(arg, 10)
            : arg;
    }

    static between(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}