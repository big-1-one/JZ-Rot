import { Range } from "./range.ts";



export class Builder {
	static shuffle(...ranges: Range[]) {}

	static mix(...ranges: Range[]) : Range[] {
        const { max, total } = ranges.reduce((acc, r) => {
            acc.max = Math.max(acc.max, r.length);
            acc.total = acc.total + r.length;
            return acc;
        }, { max: -Infinity, total: 0 });
        let contexts = ranges.map((range, pos) => {
            const { length } = range;
            const step = Math.max(1, Math.floor(max / length));
            return {
                length,
                range,
                step,
                pos,
                source: 0,
                index: step - 1,
            }
        });
		let output: Range[] = [];
        let temp: number | null = null;
		for (let index = 0; index < max; index++) {
			for (let ctx of contexts) {
                if (index !== ctx.index || ctx.source >= ctx.length) continue;
                let code = ctx.range.GetCode(ctx.source, 0);

                output.push(new Range(code, code, 1));
                ctx.index += ctx.step;
                ctx.source++;
			}
		}
        if(temp !== null) output.push(new Range(temp, temp, 1));
        return output;
	}
}