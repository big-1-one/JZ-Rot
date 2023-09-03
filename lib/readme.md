

```js
import { DataRange, Data, JRot } from './index.js';
import DataRangeBuilder from './lib/DataRangeBuilder.js';

const data = new Data("name-for-data", 64);

const jrot = new JRot(data);

const builder = new DataRangeBuilder(20, 250, 8);
const ranges = builder.GetRanges(1, true, []);


for(let r of ranges) data.AddRange(r);

var text = `{"key": "property", "name": "rot 64 cipher", "settings": ["socks", "psiphone", "v2ray"]}`;


var ecText = jrot.encrypt(text);

var dcText = jrot.decrypt(ecText);


console.log( `text === dcText => ${text === dcText}` );
```



## Installation

```console
$ npm install jz-rot
```