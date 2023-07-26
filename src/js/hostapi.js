// hostapi for sha256
export function convertUint8ArrayToWordArray(u8Array) {
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

export class Generator {
  constructor(cursor, values) {
    if(isNaN(cursor)) {
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

export class Sha256Context {
  constructor(hasher, generator, size) {
    this.hasher = hasher;
    this.generator = new Generator(generator.cursor, generator.values);
    // size is max bytes of hasher's message
    if(isNaN(size)) {
      console.log("The size must be a number.");
    } else {
      this.size = size;
    }
  }
}
