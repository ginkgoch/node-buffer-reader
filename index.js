const assert = require('assert');

module.exports = class BufferReader {
    constructor(buffer) {
        assert(Buffer.isBuffer(buffer), 'Invalid buffer.');
        this.buffer = buffer;
        this.offset = 0;
        this._makeNextReadFor('Int8', 1);
        this._makeNextReadFor('UInt8', 1);
        this._makeNextReadLEBEFor('UInt16', 2);
        this._makeNextReadLEBEFor('Int16', 2);
        this._makeNextReadLEBEFor('UInt32', 4);
        this._makeNextReadLEBEFor('Int32', 4);
        this._makeNextReadLEBEFor('Float', 4);
        this._makeNextReadLEBEFor('Double', 8);
    }

    seek(offset, fromBeginning = true) {
        if(!fromBeginning) {
            offset += this.offset;
        }

        this._checkOffsetInRange(offset);
        this.offset = offset;
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

    _makeNextReadLEBEFor(method, size) {
        this._makeNextReadFor(method + 'LE', size);
        this._makeNextReadFor(method + 'BE', size);
    }

    _makeNextReadFor(method, size) {
        BufferReader.prototype[`next${method}`] = function() {
            this._checkOffsetInRange(this.offset + size, 'Offset');
            const val = this.buffer[`read${method}`](this.offset);
            this.offset += size;
            return val;
        };
    }

    _checkPositive(number, name = 'Length') {
        assert(number >= 0, `${name} must be positive.`);
    }

    _checkOffsetInRange(offset) {
        assert(offset >= 0 && offset <= this.buffer.length, 'Offset out of range.');
    }
}