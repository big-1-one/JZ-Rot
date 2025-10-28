import { Data } from "./data.ts";

export type Options = {
    rot?: number;
    base64?: boolean;
}


export class RotX {
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
        if(this.data){
            let { rc } = this.data;
            if(rot === undefined) rot = rc;
            if(base64) input = btoa(input);
            this.data.rc = rot;
            let output = Array.from({ length: input.length }, (_, i) => this.data?.encodeChar(input[i])).join('');
            this.data.rc = rc;
            return output;
        }
    }

    decode(input: string, { rot, base64 = true }: Options){
        if(this.data){
            let { rc } = this.data;
            if(rot === undefined) rot = rc;
            this.data.rc = rot;
            let output = Array.from({ length: input.length }, (_, i) => this.data?.decodeChar(input[i])).join('');
            this.data.rc = rc;
            if(base64) output = atob(output);
            return output;
        }
    }

    static create(data?: Data){
        return new RotX(data);
    }
}
