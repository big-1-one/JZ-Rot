## Installation

```console
pnpm install jz-rot@latest
```
Or
```console
pnpm install jz-rot@>=3
```


## Example

```js
import { Range, Data, RotX, Builder } from "jz-rot";

const { log } = console;

const range1 = Range.fromArray(["a", "z", 1]);
const range2 = Range.fromObject({ from: "A", to: "Z", inc: 1 });
const range3 = Range.fromString("0:9:1", ":");

const ranges = [range1, range2, range3];

const data = Data.create("test_data", 16, range1, range3, range2);

const rot = RotX.create(data);

const input = `{"key": "property", "name": "rot 64 CIPHER", "settings": ["socks", "PSIPHONE", "v2ray"]}`;
const encoded = rot.encode(input, { /* rot: 5,  */ base64: false });
const decoded = rot.decode(encoded ?? "", { /* rot: 5,  */ base64: false });

log("(_input === _decoded) => ", input === decoded);

const _range1 = Range.fromArray(["a", "z", 1]);
const _range2 = Range.fromObject({ from: "A", to: "Z", inc: 1 });
const _range3 = Range.fromString("0:9:1", ":");

const mix = Builder.mix(_range1, _range3, _range2);

const _data = Data.create("test_data_v2", 16, ...mix);

const _rot = RotX.create(_data);

const _input = input;
const _encoded = _rot.encode(_input, { base64: true });
const _decoded = _rot.decode(_encoded ?? "", { base64: true });

log("(_input === _decoded) => ", _input === _decoded);
```