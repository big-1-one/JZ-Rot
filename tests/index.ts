import { Range, Data, RotX, Builder } from "../src/index.ts";

const { log } = console;

const range1 = Range.fromArray(["a", "z", 1]);
const range2 = Range.fromObject({ from: "A", to: "Z", inc: 1 });
const range3 = Range.fromString("0:9:1", ":");

const ranges = [range1, range2, range3];

const data = Data.create("test_data", 16, range1, range3, range2);
const codes = data.codes;
const codesObj = codes.reduce((o, c) => {
	if (c in o) o[c]++;
	else o[c] = 1;
	return o;
}, {} as Record<string, number>);
const isDuplicated = !Object.values(codesObj).every((v) => v === 1);

const rot = RotX.create(data);

const input = `{"key": "property", "name": "rot 64 CIPHER", "settings": ["socks", "PSIPHONE", "v2ray"]}`;
const encoded = rot.encode(input, { /* rot: 5,  */ base64: false });
const decoded = rot.decode(encoded ?? "", { /* rot: 5,  */ base64: false });

log("(input === decoded) => ", input === decoded);



const _range1 = Range.fromArray(["a", "z", 1]);
const _range2 = Range.fromObject({ from: "A", to: "Z", inc: 1 });
const _range3 = Range.fromString("0:9:1", ":");

const mix = Builder.mix(_range1, _range3, _range2);

const _data = Data.create("test_data_v2", 16, ...mix);
const _codes = _data.codes;
const _codesObj = _codes.reduce((o, c) => {
	if (c in o) o[c]++;
	else o[c] = 1;
	return o;
}, {} as Record<string, number>);
const _isDuplicated = !Object.values(_codesObj).every((v) => v === 1);

const _rot = RotX.create(_data);

const _input = `{"key": "property", "name": "rot 64 CIPHER", "settings": ["socks", "PSIPHONE", "v2ray"]}`;
const _encoded = _rot.encode(_input, { base64: true });
const _decoded = _rot.decode(_encoded ?? "", { base64: true });

log("(_input === _decoded) => ", _input === _decoded);



const exported = _data.export("object");
const imported = Data.import(exported);

const imported_rot = new RotX(imported);

const im_encoded = imported_rot.encode(_input, { base64: true });
const im_decoded = imported_rot.decode(im_encoded ?? "", { base64: true });


log("(_input === im_decoded) => ", _input === im_decoded);
log("(im_encoded === _encoded) => ", im_encoded === _encoded);
log("(_decoded === im_decoded) => ", _decoded === im_decoded);

log({ ranges, data, input, encoded, decoded, mix });
log({ ranges, data, input, encoded, decoded, mix });
