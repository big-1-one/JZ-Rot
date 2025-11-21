import { Range, Data, RotX, Builder } from "../src/index.ts";

const { log } = console;

const range1 = Range.fromString("0-9-1", "-");
const range2 = Range.fromString("0:9:1", ":");
const range3 = Range.fromString("0:9:1", ":");

log({ range1, range2, range3 });

log({ range1, range2, range3 });