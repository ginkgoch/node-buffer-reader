const assert = require('assert');

module.exports = class BufferReader {
    constructor(buffer) {
        assert(Buffer.isBuffer(buffer), 'Invalid buffer.');
        this.buffer = buffer;
        this.offset = 0;
    }

    seek(offset, fromBeginning = true) {
        if(!fromBeginning) {
            offset += this.offset;
        }

        this._checkOffsetInRange(offset);
        this.offset = offset;
    }

    nextDoubleLE() {
        return this._nextXX('DoubleLE', 8);
    }
    
    nextDoubleBE() {
        return this._nextXX('DoubleBE', 8);
    }

    nextFloatLE() {
        return this._nextXX('FloatLE', 4);
    }
    
    nextFloatBE() {
        return this._nextXX('FloatBE', 4);
    }

    nextInt32LE() {
        return this._nextXX('Int32LE', 4);
    }
    
    nextInt32BE() {
        return this._nextXX('Int32BE', 4);
    }

    nextUInt32LE() {
        return this._nextXX('UInt32LE', 4);
    }
    
    nextUInt32BE() {
        return this._nextXX('UInt32BE', 4);
    }

    nextUInt16LE() {
        return this._nextXX('UInt16LE', 2);
    }
    
    nextUInt16BE() {
        return this._nextXX('UInt16BE', 2);
    }

    nextInt16LE() {
        return this._nextXX('Int16LE', 2);
    }
    
    nextInt16BE() {
        return this._nextXX('Int16BE', 2);
    }

    nextUInt8() {
        return this._nextXX('UInt8', 1);
    }

    nextInt8() {
        return this._nextXX('Int8', 1);
    }

    nextBuffer(length) {
        this._checkPositive(length);
        this._checkOffsetInRange(this.offset + length);

        const buffer = Buffer.alloc(length);
        this.buffer.copy(buffer, 0, this.offset, this.offset + length);
        this.offset += length;
        return buffer;
    }

    nextString(length, encoding = 'utf-8') {
        this._checkPositive(length);
        this._checkOffsetInRange(this.offset + length);
        const str = this.buffer.toString(encoding, this.offset, this.offset + length);
        this.offset += length;
        return str;
    }

    _nextXX(type, size) {
        this._checkOffsetInRange(this.offset + size, 'Offset');

        const v = this.buffer[`read${type}`](this.offset);
        this.offset += size;
        return v;
    }

    _checkPositive(number, name = 'Length') {
        assert(number >= 0, `${name} must be positive.`);
    }

    _checkOffsetInRange(offset) {
        assert(offset >= 0 && offset <= this.buffer.length, 'Offset out of range.');
    }
}