# Ginkgoch Buffer Reader for NodeJS
This is a NodeJS library to help to read [Buffer](https://cn.nodejs.org/api/buffer.html) instance easily.

## Install
```terminal
npm i ginkgoch-buffer-reader --save
```

## Test
```terminal
npm test
```

## Example

**Prepare for data**
```js
const buffer = Buffer.alloc(4);
buffer.writeInt8(8, 0);
buffer.writeInt16LE(16, 1);
buffer.writeUInt32LE(32, 3);
buffer.writeDoubleBE(54.8765, 7);
```

**Without `Ginkgoch Buffer Reader`**
```js
let i1 = buffer.readInt8(0);
let i2 = buffer.readInt16LE(1);
let i3 = buffer.readUInt32LE(3);
let i4 = buffer.readDoubleBE(7);
```

**With `Ginkgoch Buffer Reader`**
It automatically manages the read position for you. You don't need to remember the position and the boring type length calculations.
```js
const BufferReader = require('ginkgoch-buffer-reader');
let br = new BufferReader(buffer);
let i1 = br.nextInt8();
let i2 = br.nextInt16LE();
let i3 = br.nextUInt32LE();
let i4 = br.nextDoubleBE();
```

## API
```js
constructor(buffer: Buffer);
seek(offset: number, fromBeginning = true);
nextBuffer(length: number);
nextString(length: number, encoding = 'utf-8');
nextIn8();
nextUInt8();
nextUInt16LE();
nextUInt16BE();
nextInt16LE();
nextInt16BE();
nextUInt32LE();
nextUInt32BE();
nextInt32LE();
nextInt32BE();
nextFloatLE();
nextFloatBE();
nextDoubleLE();
nextDoubleBE();
```

## Issues
Contact [ginkgoch@outlook.com](mailto:ginkgoch@outlook.com) or [sumbit an issue](https://github.com/ginkgoch/node-buffer-reader/issues).