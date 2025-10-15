const fs = require('fs');
const path = require('path');

const uri = 'idl\\test\\scratch\\test.pro';

const strings = fs.readFileSync(uri, 'utf-8');

fs.writeFileSync(uri, strings.replace(/\r?\n/g, '\r'));
