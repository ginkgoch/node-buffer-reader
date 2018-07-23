const BufferReader = require('./index.js');

describe('buffer reader tests', () => {
    test('init test - normal', () => {
        const buffer = Buffer.alloc(4);
        const br = new BufferReader(buffer);
        expect(br).not.toBeNull();
        expect(br).not.toBeUndefined();
    });

    test('init test - not buffer', () => {
        const buffer = undefined;
        function init() { const br = new BufferReader(buffer); }
        expect(init).toThrow(/Invalid buffer./);
    });

    test('seek from beginning - normal', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        expect(br.offset).toBe(0);
        expect(br.buffer).not.toBeNull();
        expect(br.buffer).not.toBeUndefined();
        br.seek(2);
        expect(br.offset).toBe(2);
    });

    test('seek from current - normal', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        br.seek(1);
        expect(br.offset).toBe(1);
        br.seek(1, false);
        expect(br.offset).toBe(2);
        br.seek(1, false);
        expect(br.offset).toBe(3);
        br.seek(1);
        expect(br.offset).toBe(1);
    });

    test('seek from beginning - out of range', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        expect(() => br.seek(5)).toThrow(/Offset out of range./);
    });

    test('seek from current - out of range', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        br.seek(2);
        br.seek(3);
        expect(() => br.seek(2, false)).toThrow(/Offset out of range./);
    });

    test('nextBuffer test - positive', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        expect(() => br.nextBuffer(-1)).toThrow(/Length must be positive./);
    });

    test('nextBuffer test - oor', () => {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const br = new BufferReader(buffer);
        expect(() => br.nextBuffer(5)).toThrow(/Offset out of range./);
    });

    test('nextBuffer test - normal', () => {
        const buffer1 = Buffer.from([1, 2, 3, 4]);
        const buffer2 = Buffer.from([4, 5]);
        const br = new BufferReader(Buffer.concat([buffer1, buffer2]));
        const nBuffer1 = br.nextBuffer(4);
        const nBuffer2 = br.nextBuffer(2);
        expect(Buffer.compare(buffer1, nBuffer1, 0));
        expect(Buffer.compare(buffer2, nBuffer2, 0));
    });

    test('nextString test - normal', () => {
        const str = 'hello world 01!';
        const buffer = new Buffer(str, 'utf-8');
        const br = new BufferReader(Buffer.concat([Buffer.from([0, 2]), buffer]));
        br.seek(2);
        const nStr = br.nextString(15, 'utf-8');
        expect(nStr).toEqual(str);
    });

    test('nextString test - positive', () => {
        const br = new BufferReader(new Buffer('hello', 'utf-8'));
        expect(() => br.nextString(-1)).toThrow(/Length must be positive./);
    });

    test('nextString test - oor', () => {
        const br = new BufferReader(new Buffer('hello', 'utf-8'));
        expect(() => br.nextString(6)).toThrow(/Offset out of range./);
    });

    test('nextInt8 test', () => {
        const buffer = Buffer.alloc(4);
        buffer.writeInt8(1, 0);
        buffer.writeInt8(2, 1);
        buffer.writeInt8(3, 2);
        buffer.writeInt8(4, 3);
        const br = new BufferReader(buffer);

        expect(br.nextInt8()).toBe(1);
        expect(br.nextInt8()).toBe(2);
        expect(br.nextInt8()).toBe(3);
        expect(br.nextInt8()).toBe(4);
        expect(() => br.nextInt8()).toThrow(/Offset out of range./);
    });

    test('nextInt16LE test', () => {
        const buffer = Buffer.alloc(4);
        buffer.writeInt16LE(16, 0);
        buffer.writeInt16LE(32, 2);
        const br = new BufferReader(buffer);

        expect(br.nextInt16LE()).toBe(16);
        expect(br.nextInt16LE()).toBe(32);
        expect(() => br.nextInt16LE()).toThrow(/Offset out of range./);
    });

    test('nextInt16BE test', () => {
        const buffer = Buffer.alloc(4);
        buffer.writeInt16BE(16, 0);
        buffer.writeInt16BE(32, 2);
        const br = new BufferReader(buffer);

        expect(br.nextInt16BE()).toBe(16);
        expect(br.nextInt16BE()).toBe(32);
        expect(() => br.nextInt16BE()).toThrow(/Offset out of range./);
    });

    test('nextUInt32LE test', () => {
        const buffer = Buffer.alloc(8);
        buffer.writeUInt32LE(16, 0);
        buffer.writeUInt32LE(32, 4);
        const br = new BufferReader(buffer);

        expect(br.nextUInt32LE()).toBe(16);
        expect(br.nextUInt32LE()).toBe(32);
        expect(() => br.nextUInt32LE()).toThrow(/Offset out of range./);
    });

    test('nextDoubleBE test', () => {
        const buffer = Buffer.alloc(16);
        const d1 = 12.3432;
        const d2 = 32.8976;
        buffer.writeDoubleBE(d1, 0);
        buffer.writeDoubleBE(d2, 8);
        const br = new BufferReader(buffer);

        expect(br.nextDoubleBE()).toBe(d1);
        expect(br.nextDoubleBE()).toBe(d2);
        expect(() => br.nextDoubleBE()).toThrow(/Offset out of range./);
    });

    test('demo test', () => {
        const buffer = Buffer.alloc(15);
        buffer.writeInt8(8, 0);
        buffer.writeInt16LE(16, 1);
        buffer.writeUInt32LE(32, 3);
        buffer.writeDoubleBE(54.8765, 7);

        // original
        expect(buffer.readInt8(0)).toBe(8);
        expect(buffer.readInt16LE(1)).toBe(16);
        expect(buffer.readUInt32LE(3)).toBe(32);
        expect(buffer.readDoubleBE(7)).toBe(54.8765);

        // new
        const br = new BufferReader(buffer);
        expect(br.nextInt8()).toBe(8);
        expect(br.nextInt16LE()).toBe(16);
        expect(br.nextUInt32LE()).toBe(32);
        expect(br.nextDoubleBE()).toBe(54.8765);
    });
});