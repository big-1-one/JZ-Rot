
namespace Range {
    type Arg<T extends string> = number | SingleChar<T> | StringCode<T>;
}
export type SingleChar<T extends string> = T extends `${infer First}${infer Rest}`
    ? Rest extends ""
        ? First
        : never
    : never;

export type StringCode<T extends string> = T extends `${number}`
    ? T
    : never;

export type RangeArgString<T extends string> = StringCode<T> | SingleChar<T>;

export type RangeSeparators = ":" | "-" | "," | ";" | string & {};

export type RangeStringArgsNumber = {
    [K in RangeSeparators]: `${number}${K}${number}${K}${number}`
}[RangeSeparators];
export type RangeArrayArgsNumber = [ from: number, to: number, inc?: number ];
export type RangeObjectArgsNumber = { from: number, to: number, inc?: number };

// export type RangeArrayArgsString = [ from: char, to: char, inc?: number ];
// export type RangeObjectArgsString = { from: string, to: string, inc?: number };
export type RangeStringArgsString = {
    [K in RangeSeparators]: `${string}${K}${string}${K}${number}`
}[RangeSeparators];
export type RangeArrayArgsString<T extends string> = [ from: RangeArgString<T>, to: RangeArgString<T>, inc?: number ];
export type RangeObjectArgsString<T extends string> = { from: RangeArgString<T>, to: RangeArgString<T>, inc?: number };

// export type RangeStringArgs<
//     T extends string,
//     S extends RangeSeparators,
//     V extends RangeStringValues<T, S> = RangeStringValues<T, S>,
//     A1 = RangeArgString<V[0]>,
//     A2 = RangeArgString<V[1]>,
//     C = RangeArgString<V[2]>
//     > = `${typeof A1}${S}${A2}${S}${C}`;


type RangeStringValues<T extends string, S extends RangeSeparators> = 
    T extends `${infer A}${S}${infer B}${S}${infer C}`
        ? [A, B, C]
        : never;
type RangeStringA1<T extends string, S extends RangeSeparators> = 
    T extends `${infer A}${S}${infer B}${S}${infer C}`
        ? A extends RangeArgString<A>
            ? `${A}`
            : never
        : never;
type RangeStringA2<T extends string, S extends RangeSeparators> = 
    T extends `${infer A}${S}${infer B}${S}${infer C}`
        ? B extends RangeArgString<B>
            ? `${B}`
            : never
        : never;
type RangeStringC<T extends string, S extends RangeSeparators> = 
    T extends `${infer A}${S}${infer B}${S}${infer C}`
        ? C extends `${number}`
            ? `${C}`
            : never
        : never;

export type Is<T extends string, S extends RangeSeparators> = 
    T extends `${infer A}${S}${infer B}${S}${infer C}`
        ? A extends RangeArgString<A>
            ? B extends RangeArgString<B>
                ? C extends `${number}`
                    ? `${A}${S}${B}${S}${C}`
                    : never
                : never
            : never
        : never;


export type RangeArrayArgs<T extends string> = RangeArrayArgsNumber | RangeArrayArgsString<T>;
export type RangeObjectArgs<T extends string> = RangeObjectArgsNumber | RangeObjectArgsString<T>;

export type RangeArg = String | number;

export type RangeType = "string" | "array" | "object";
export type RangeExportMethod = `as${Capitalize<RangeType>}`;

export type DataJson = {
    tag: string;
    rc: number;
    type: RangeType;
    ranges: (RangeStringArgsNumber | RangeArrayArgsNumber | RangeObjectArgsNumber)[];
}