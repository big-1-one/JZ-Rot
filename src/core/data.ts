import type {
	RangeArg,
	RangeArrayArgsNumber,
	RangeExportMethod,
	RangeType,
	RangeObjectArgsNumber,
	RangeSeparators,
	RangeStringArgsNumber,
} from "./types.ts";
import { Range } from "./range.ts";
import type { IRange } from "./range.ts";


export interface IData {
	get rc(): number;
	get ranges(): Range[] | IRange[];
	get lastRange(): Range | IRange;
	get length(): number;
	HasIndex(index: number): boolean;
	Has(code: number): boolean;
	GetIndex(index: number): number | -1;
	GetCode(index: number): number | -1;
	GetChar(index: number): string | undefined;
	AddRange(range: IRange): this;
	AddRanges(ranges: IRange[]): this;
	encodeCode(code: number): number;
	encodeChar(char: string): string;
	decodeCode(code: number): number;
	decodeChar(char: string): string;
}

export class Data implements IData {
	static defaultSeparator: RangeSeparators = ":";

	public tag: string;
	public rc: number;
	public ranges: Range[];

	constructor(tag: string, rc: number = 7, ...ranges: Range[]) {
		this.tag = tag;
		this.rc = rc;
		this.ranges = [];
		this.AddRanges(ranges);
	}

	get lastRange() {
		return this.ranges[this.ranges.length - 1];
	}

	get length() {
		return (this.lastRange?.lastIndex ?? -1) + 1;
	}

	get codes() {
		return this.ranges.reduce((arr, r) => r.GetCodes(arr), [] as number[]);
	}

	get chars() {
		return this.ranges.reduce((arr, r) => r.GetChars(arr), [] as string[]);
	}

	HasIndex(index: number): boolean {
		if (this.length == 0) return false;
		return index < this.length && index >= 0;
	}

	Has(arg: RangeArg): boolean;
	Has(char: string): boolean;
	Has(code: number): boolean;
	Has(char: RangeArg): boolean {
		return this.ranges.some((r) => r.Has(char));
	}

	GetIndex(arg: RangeArg): number | -1;
	GetIndex(char: string): number | -1;
	GetIndex(code: number): number | -1;
	GetIndex(char: RangeArg): number | -1 {
		let index: number = -1;
		this.ranges.find((r) => {
			index = r.GetIndex(char);
			return index != -1;
		});
		return index;
	}

	GetCode(index: number): number | -1 {
		if (this.HasIndex(index)) {
			let r = this.ranges.find((r) => r.HasIndex(index));
			if (r) return r.GetCode(index);
		}
		return -1;
	}

	GetChar(index: number): string | undefined {
		let code = this.GetCode(index);
		if (code == -1) return;
		return String.fromCharCode(code);
	}

	AddRange(range: Range) {
		this.ranges.forEach((r) => {
			let conflict = r.IsConflict(range);
			if (!conflict) return;
			let rol = r.length < range.length;
			let _range = rol ? range : r;
			let codes = rol ? r.codes : range.codes;
			let code = codes.find((c) => _range.Has(c));
			if (code !== undefined)
				throw `conflict between ranges ${r} , ${range} in ${code}`;
		});
		range.index = this.length;
		this.ranges.push(range);
		return this;
	}

	AddRanges(ranges: Range[]) {
		ranges.forEach((r) => this.AddRange(r));
		return this;
	}

	AddRangeAsString(
		rangeStr: RangeStringArgsNumber,
		separator: RangeSeparators = Data.defaultSeparator
	) {
		let range = Range.fromString(rangeStr, separator);
		return this.AddRange(range);
	}

	AddRangeAsObject(rangeObj: RangeObjectArgsNumber) {
		let range = Range.fromObject(rangeObj);
		return this.AddRange(range);
	}

	AddRangeAsArray(rangeObj: RangeArrayArgsNumber) {
		let range = Range.fromArray(rangeObj);
		return this.AddRange(range);
	}

	encodeCode(code: number): number {
		let index = this.GetIndex(code);
		if (index == -1) return code;
		index = (index + this.rc) % this.length;
		let code2 = this.GetCode(index);
		return code2 == -1 ? code : code2;
	}

	encodeChar(char: string): string {
		let code = char.charCodeAt(0);
		return String.fromCharCode(this.encodeCode(code));
	}

	decodeCode(code: number): number {
		let index = this.GetIndex(code);
		if (index == -1) return code;
		index = (index - this.rc) % this.length;
		index = index < 0 ? index + this.length : index;
		let code2 = this.GetCode(index);
		return code2 == -1 ? code : code2;
	}

	decodeChar(char: string): string {
		let code = char.charCodeAt(0);
		return String.fromCharCode(this.decodeCode(code));
	}

	export(type: RangeType = "string"): string {
		let { tag, rc, ranges } = this;
		const methods: Record<RangeType, RangeExportMethod> = {
			string: "asString",
			object: "asObject",
			array: "asArray",
		};
		let method = methods[type];
		let exportedRanges = ranges.map((r) => r[method]);
		return JSON.stringify({
			tag,
			rc,
			type,
			ranges: exportedRanges,
		});
	}

	import(data: string) {}

	static create(tag: string, rc: number = 7, ...ranges: Range[]): Data {
		return new Data(tag, rc, ...ranges);
	}
}
