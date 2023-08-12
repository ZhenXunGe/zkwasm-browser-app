const CryptoJS = require('crypto-js');

// hostapi for sha256
function convertUint8ArrayToWordArray(u8Array) {
  var words = [], i = 0, len = u8Array.length;

  while (i < len) {
    words.push(
      (u8Array[i++] << 24) |
      (u8Array[i++] << 16) |
      (u8Array[i++] << 8)  |
      (u8Array[i++])
    );
  }

  return {
    sigBytes: words.length * 4,
    words: words
  };
}

class Generator {
  constructor(cursor, values) {
    if(!Number.isInteger(cursor)) {
      console.log("The cursor must be a number.");
      return;
    } else {
      this.cursor = cursor;
    }
    if(values instanceof Array) {
      this.values = values;
    } else {
      console.log("The values must be an array.");
      return;
    }
  }

  // Get value at index cursor
  gen() {
    let value = this.values[this.cursor];
    this.cursor += 1;
    return value;
  }
}

class Sha256Context {
  constructor(hasher, generator, size) {
    this.hasher = hasher;
    this.generator = new Generator(generator.cursor, generator.values);
    // size is max bytes of hasher's message
    if(!Number.isInteger(size)) {
      console.log("The size must be a number.");
    } else {
      this.size = size;
    }
    // true means hashing is in progress
    this.finalized = true;
  }
}

// context is a Sha256Context instance
// The size is max bytes of hasher's message ans it must be an integer
function sha256New(context, size) {
  try {
    if(context.hasher) {
      console.log("The hasher already exist.");
      return;
    } else {
      context.hasher = CryptoJS.algo.SHA256.create();
      context.size = size;
      context.finalized = false;
    }
  } catch(e) {
    console.log(e);
  }
}

// context is a Sha256Context instance
// The message must be an integer
function sha256Push(context, message) {
  try {
    if(context.finalized) {
      throw new Error("AlreadyFinalized");
    }
    if(!context.hasher) {
      throw new Error("HasherNotExist");
    }
    if(!Number.isInteger(message)) {
      throw new Error("MessageIsNotNumber");
    }

    let sz;
    if(context.size > 8) {
      context.size -= 8;
      sz = 8;
    } else {
      sz = context.size;
      context.size = 0;
    }

    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    let offset = 0;
    const littleEndian = true;
    // Split message to 2 unsigned 32-bit integer
    let binMessage = message.toString(2).padStart(64, 0);
    let lowU32Message = parseInt(binMessage.slice(32), 2);
    let highU32Message = parseInt(binMessage.slice(0, 32), 2);

    // set uint32 every 4 bytes
    view.setUint32(offset, lowU32Message, littleEndian);
    view.setUint32(offset + 4, highU32Message ,littleEndian);
    let uint8Message = new Array();
    for(let i = 0; i < view.byteLength; i++) {
      uint8Message.push(view.getUint8(i));
    }
    let uint8WordArray = convertUint8ArrayToWordArray(uint8Message.slice(0, sz));
    context.hasher.update(uint8WordArray);
  } catch(e) {
    console.log(e);
  }
}

// Get hash and reset context
// context is a Sha256Context instance
function sha256Finalize(context) {
  try {
    if(context.finalized) {
      throw new Error("AlreadyFinalized");
    }
    if(!context.hasher) {
      throw new Error("HasherNotExist");
    }

    let hash = context.hasher.finalize().toString();
    const buffer = new ArrayBuffer(32);
    const view = new DataView(buffer);
    const littleEndian = true;
    let sliceEnd = hash.length;
    let offset = 0;
    while(offset < buffer.byteLength) {
      // Split hash to 8 unsigned 32-bit integer
      let hashSlice = parseInt(hash.slice(sliceEnd - 8, sliceEnd), 16);
      view.setUint32(offset, hashSlice, littleEndian);
      // every 8 character is 32 bits
      sliceEnd -= 8;
      // set uint32 every 4 bytes
      offset +=4;
    }

    let uint64Array = new Array();
    let i = 0;
    while(i < buffer.byteLength) {
      uint64Array.push(view.getBigUint64(i));
      // read every 8 bytes of buffer
      i += 8;
    }
    context.generator.values = uint64Array;
    context.hasher = undefined;
    context.finalized = true;
    return context.generator.gen();
  } catch(e) {
    console.log(e);
  }
}

module.exports = { Generator, Sha256Context, sha256New, sha256Push, sha256Finalize };
