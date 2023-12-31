## Example

```js
import { DataRange, Data, JRot, DataRangeBuilder } from 'jz-rot';

const data = new Data("name-for-data", 64);

const jrot = new JRot(data);

const builder = new DataRangeBuilder(20, 250, 8);
const ranges = builder.GetRanges(1, true, []);

data.AddRanges(ranges);

var text = `{"key": "property", "name": "rot 64 CIPHER", "settings": ["socks", "PSIPHONE", "v2ray"]}`;

var ecText = jrot.encrypt(text, true);

var dcText = jrot.decrypt(ecText, true);

console.log( `text === dcText => ${text === dcText}` );
```
## Import & Export
```js
var exData = data.export("string"); // export json as string;

var imData = Data.import(exData); // import from string json;

var jrot2 = new JRot(imData);

var ecText1 = jrot2.encrypt(text, false);
var dcText1 = jrot2.decrypt(ecText1, false);

var dcText2 = jrot2.decrypt(ecText, true);

console.log( `ecText === ecText1 => ${ecText === ecText1}` );
console.log( `dcText === dcText1 => ${dcText === dcText1}` );
console.log( `dcText === dcText2 => ${dcText === dcText2}` );
```

## Rot13 Class
```js
import { Rot13 } from 'jz-rot';

var ecRot13 = Rot13.encrypt(text, true);
var deRot13 = Rot13.decrypt(ecRot13, true);

console.log( `text === deRot13 => ${text === deRot13}` );
```


## Installation

```console
$ npm install jz-rot
```