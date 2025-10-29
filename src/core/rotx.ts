import { Data } from "./data.ts";
import type { IData } from "./data.ts";

export type Options = {
    rot?: number;
    base64?: boolean;
}

export interface IRotX {
    data: Data | IData | undefined;
    encode(input: string, { rot, base64 }: Options): string;
    decode(input: string, { rot, base64 }: Options): string;
}


export class RotX implements IRotX {
    public data: Data | undefined;


    constructor(data?: Data){
        data && this.setData(data);
    }

    setData(data: Data){
        if(data instanceof Data === false){
            throw new Error("RotX: data must be an instance of Data class");
        }
        this.data = data;
        return this;
    }

    encode(input: string, { rot, base64 = true }: Options){
        if(!this.data) return input;
        let { rc } = this.data;
        if(rot === undefined) rot = rc;
        if(base64) input = btoa(input);
        this.data.rc = rot;
        let output = Array.from({ length: input.length }, (_, i) => this.data?.encodeChar(input[i])).join('');
        this.data.rc = rc;
        return output;
    }

    decode(input: string, { rot, base64 = true }: Options){
        if(!this.data) return input;
        let { rc } = this.data;
        if(rot === undefined) rot = rc;
        this.data.rc = rot;
        let output = Array.from({ length: input.length }, (_, i) => this.data?.decodeChar(input[i])).join('');
        this.data.rc = rc;
        if(base64) output = atob(output);
        return output;
    }

    static create(data?: Data){
        return new RotX(data);
    }
}
