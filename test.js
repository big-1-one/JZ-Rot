// import { DataRange, Data, JRot, DataRangeBuilder, Rot13 } from './index.mjs';
const { DataRange, Data, JRot, DataRangeBuilder, Rot13 } = require('.');


const CODE = {
    a : "a".charCodeAt(),
    A : "A".charCodeAt(),
    z : "z".charCodeAt(),
    Z : "Z".charCodeAt(),
    0 : "0".charCodeAt(),
    9 : "9".charCodeAt(),

    from : 0,
    to : 300,
    inc : 4,
    rc : 64,
    tag : "Rot-64_complex"
}

// var from = CODE.from;
// var to = CODE.to;
// var inc = CODE.inc;

var data = new Data(CODE.tag, CODE.rc);

var jrot = new JRot(data);

var builder = new DataRangeBuilder(CODE.from, CODE.to, CODE.inc);


data.AddRanges(builder.GetRanges(1, true, []));


var text = `{"key": "property", "name": "rot 64 CIPHER", "settings": ["socks", "PSIPHONE", "v2ray", "0123456789"]}`;

var ecText = jrot.encrypt(text, true);
var dcText = jrot.decrypt(ecText, true);


console.log( `text === dcText => ${text === dcText}` );


var exData = data.export("string");
var imData = Data.import(exData);

var jrot1 = new JRot(imData);

var ecText1 = jrot1.encrypt(text, true);
var dcText1 = jrot1.decrypt(ecText1, true);

var dcText2 = jrot1.decrypt(ecText, true);


console.log( `ecText === ecText1 => ${ecText === ecText1}` );
console.log( `dcText === dcText1 => ${dcText === dcText1}` );
console.log( `dcText === dcText2 => ${dcText === dcText2}` );

var ecRot13 = Rot13.encrypt(text, false);
var deRot13 = Rot13.decrypt(ecRot13, false);

console.log( `text === deRot13 => ${text === deRot13}` );

// console.log( `Rot13.encrypt => ${Rot13.encrypt(text, true)}` );
// console.log( `Rot13.decrypt => ${Rot13.decrypt(Rot13.encrypt(text, true), true)}` );
// console.log( `Rot13.run => ${Rot13.run(text)}` );
// console.log( `Rot13.run.run => ${Rot13.run(Rot13.run(text))}` );

console.log();