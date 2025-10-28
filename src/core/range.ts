import type {
	RangeArg,
	RangeArrayArgs,
	RangeArrayArgsNumber,
	RangeObjectArgs,
	RangeObjectArgsNumber,
	RangeSeparators,
	RangeStringArgsNumber,
	RangeStringArgsString,
} from "./types.d.ts";

export class Range {
	static defaultInc: number = 1;
	static defaultSeparator: RangeSeparators = ":";

	public from: number;
	public to: number;
	public inc: number;
	public index: number;

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
		return this.GetCodes();
	}

	get chars() {
		return this.GetChars();
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
		if (typeof arg === "string") arg = arg.charCodeAt(0);
		if (typeof arg === "number" && this.from <= arg && arg <= this.to)
			return true;
		return false;
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
		if (typeof arg == "string") arg = arg.charCodeAt(0);
		if (!this.InRange(arg)) return -1;
		if (this.from == arg) return this.index;
		if (this.to == arg) return this.lastIndex;
		let index = ((arg as number) - this.from) / this.inc;
		if (!Number.isInteger(index)) return -1;
		return this.index + index;
	}

	// get code by index;
	GetCode(index: number, start: number = this.index): number | -1 {
		index = index - start;
		let length = this.length - 1;
		if (index == length) return this.to;
		if (index > length) return -1;
		return this.from + this.inc * index;
	}

	// get char by index;
	GetChar(index: number, start: number = this.index): string | undefined {
		var code = this.GetCode(index, start);
		if (code == -1) return;
		return String.fromCharCode(code);
	}

	GetCodes(arr: number[] = []): number[] {
		const { from, to, inc, length } = this;
		for (let i = 0; i < length - 1; i++) arr.push(from + i * inc);
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
		const nFrom = typeof from === "string"
			? from.length === 1
				? from.charCodeAt(0)
				: parseInt(from)
			: from;
		const nTo = typeof to === "string"
			? to.length === 1
				? to.charCodeAt(0)
				: parseInt(to)
			: to;
		return new Range(nFrom, nTo, inc);
	}

	static fromArray<T extends string>(args: RangeArrayArgs<T>): Range {
		const [from, to, inc = Range.defaultInc] = args;
		const nFrom = typeof from === "string"
			? from.length === 1
				? from.charCodeAt(0)
				: parseInt(from)
			: from;
		const nTo = typeof to === "string"
			? to.length === 1
				? to.charCodeAt(0)
				: parseInt(to)
			: to;
		return new Range(nFrom, nTo, inc);
	}

	static fromString<T extends string, S extends RangeSeparators>(
		string: RangeStringArgsNumber | RangeStringArgsString,
		separator?: S
	): Range {
		const [from, to, inc = Range.defaultInc] = string
			.split(separator || Range.defaultSeparator)
			.map((part) => part.length === 1? part.charCodeAt(0): parseInt(part));
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