import type {
	RangeArg,
	RangeArrayArgs,
	RangeArrayArgsNumber,
	RangeObjectArgs,
	RangeObjectArgsNumber,
	RangeSeparators,
	RangeStringArgsNumber,
	RangeStringArgsString,
} from "./types.ts";
import { Utils } from "../utils/index.ts";

export interface IRange {
	get index(): number;
	get length(): number;
	get lastIndex(): number;
	InRange(code: number): boolean;
	IsConflict(range: IRange): boolean;
	HasIndex(index: number): boolean;
	Has(code: number): boolean;
	GetIndex(code: number): number | -1;
	GetCode(index: number, start?: number): number | -1;
	GetChar(index: number, start?: number): string | undefined;
	GetCodes(arr?: number[]): number[];
	GetChars(arr?: string[]): string[];
}
export class Range implements IRange {
	static defaultInc: number = 1;
	static defaultSeparator: RangeSeparators = ":";

	public from: number;
	public to: number;
	public inc: number;
	public index: number;

	private _codes: number[] | undefined;
	private _chars: string[] | undefined;

	constructor(...args: RangeArrayArgsNumber) {
		const [from, to, inc = Range.defaultInc] = args;
		this.from = from;
		this.to = to;
		this.inc = inc;
		this.index = 0;
	}

	get length() {
		return Math.ceil((this.to - this.from) / this.inc) + 1;
	}

	get lastIndex() {
		return this.index + (this.length - 1);
	}

	get codes() {
		return this._codes ??= this.GetCodes();
	}

	get chars() {
		return this._chars ??= this.GetChars();
	}

	get asObject() {
		return this.toObject();
	}

	get asArray() {
		return this.toArray();
	}

	get asString() {
		return this.toString();
	}

	InRange(arg: RangeArg): boolean;
	InRange(char: string): boolean;
	InRange(code: number): boolean;
	InRange(arg: RangeArg): boolean {
		const code = Utils.parse(arg as string | number);
		return code >= this.from && code <= this.to;
	}

	IsConflict(range: Range): boolean {
		return Range.isConflict(this, range);
	}

	HasIndex(index: number): boolean {
		return this.index <= index && index <= this.lastIndex;
	}

	Has(arg: RangeArg): boolean;
	Has(char: string): boolean;
	Has(code: number): boolean;
	Has(arg: RangeArg): boolean {
		return this.GetIndex(arg) != -1;
	}

	GetIndex(arg: RangeArg): number | -1;
	GetIndex(char: string): number | -1;
	GetIndex(code: number): number | -1;
	GetIndex(arg: RangeArg): number | -1 {
		const code = Utils.parse(arg as string | number);
		let index = (code - this.from) / this.inc;
		if (!this.InRange(code)) return -1;
		return Number.isInteger(index) ? this.index + index : -1;
	}

	// get code by index;
	GetCode(index: number, start: number = this.index): number | -1 {
		index = index - start;
		if (index < 0 || index >= this.length) return -1;

		return index === this.length - 1 
			? this.to 
			: this.from + this.inc * index;
	}

	// get char by index;
	GetChar(index: number, start: number = this.index): string | undefined {
		const code = this.GetCode(index, start);
		return code === -1 ? undefined : String.fromCharCode(code);
	}

	GetCodes(arr: number[] = []): number[] {
		const { from, to, inc, length } = this;
		for (let i = 0; i < length - 1; i++)
			arr.push(from + i * inc);
		arr.push(to);
		return arr;
	}

	GetChars(arr: string[] = []): string[] {
		const { from, to, inc, length } = this;
		for (let i = 0; i < length - 1; i++)
			arr.push(String.fromCodePoint(from + i * inc));
		arr.push(String.fromCodePoint(to));
		return arr;
	}

	toObject(): RangeObjectArgsNumber {
		const { from, to, inc } = this;
		return { from, to, inc };
	}

	toArray(): RangeArrayArgsNumber {
		return [this.from, this.to, this.inc];
	}

	toString(
		separator: RangeSeparators = Range.defaultSeparator
	): RangeStringArgsNumber {
		return this.toArray().join(separator) as RangeStringArgsNumber;
	}

	static fromObject<T extends string>(args: RangeObjectArgs<T>): Range {
		const { from, to, inc = Range.defaultInc } = args;
		const nFrom = Utils.parse(from);
		const nTo = Utils.parse(to);
		return new Range(nFrom, nTo, inc);
	}

	static fromArray<T extends string>(args: RangeArrayArgs<T>): Range {
		const [from, to, inc = Range.defaultInc] = args;
		const nFrom = Utils.parse(from);
		const nTo = Utils.parse(to);
		return new Range(nFrom, nTo, inc);
	}

	static fromString<T extends string, S extends RangeSeparators>(
		string: RangeStringArgsNumber | RangeStringArgsString,
		separator?: S
	): Range {
		const [from, to, inc = Range.defaultInc] = string
			.split(separator || Range.defaultSeparator)
			.map((part, i) => i == 2 ? Utils.parse(part): Number.parseInt(part));
		return new Range(from, to, inc);
	}

	static isConflict(rangeA: Range, rangeB: Range): boolean {
		return (
			rangeA.InRange(rangeB.from) ||
			rangeA.InRange(rangeB.to) ||
			rangeB.InRange(rangeA.from) ||
			rangeB.InRange(rangeA.to)
		);
	}

	static create(...args: RangeArrayArgsNumber): Range {
		return new Range(...args);
	}
}