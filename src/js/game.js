import makeWasm from "./gameplay.wasm";
import { __wbg_set_wasm } from "./gameplay.wasm_bg";
import CryptoJS from 'crypto-js';
const { Module, instantiate, Memory, Table } = WebAssembly;

var instance = null;

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

class Sha256Context {
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

var sha256Context = new Sha256Context(undefined, new Generator(0, []), 0);

// The size is max bytes of hasher's message
function sha256New(context, size) {
  try {
    if(context.hash) {
      console.log("The hsher already exist.");
      return;
    } else {
      sha256Context.hasher = CryptoJS.algo.SHA256.create();
      sha256Context.size = size;
      this.finalized = false;
    }
  } catch(e) {
    console.log(e);
  }
}

function sha256Push(context, message) {
  try {
    if(this.finalized) {
      throw new Error("AlreadyFinalized");
    }
    if(!context.hash) {
      throw new Error("HasherNotExist");
    }
    if(isNaN(message)) {
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

    // Convert big endian to little endian
    let uint8Message = new Uint8Array(message).reverse().slice(0, sz);
    let uint8WordArray = convertUint8ArrayToWordArray(uint8Message);
    context.hasher.update(uint8WordArray);
  } catch(e) {
    console.log(e);
  }
}

// Get hash and reset context
function sha256Finalize(context) {
  try {
    if(this.finalized) {
      throw new Error("AlreadyFinalized");
    }
    if(!context.hash) {
      throw new Error("HasherNotExist");
    }

    let hash = context.hasher.finalize();
    // Convert big endian to little endian
    let uint8Hash = new Uint8Array(hash).reverse();
    const chunkSize = 8;
    let uint64Array;
    for (let i = 0; i < uint8Hash.length; i += chunkSize) {
      // split hash into chunks
      const chunk = uint8Hash.slice(i, i + chunkSize);
      const uint64Value = new DataView(chunk).getBigUint64();
      uint64Array.push(uint64Value);
    }

    context.generator.values = uint64Array;
    context.hasher = undefined;
    this.finalized = true; 
    return context.generator.gen(); 
  } catch(e) {
    console.log(e);
  }
}

export default async function () {
  if (instance != null) {
    return instance.exports;
  } else {
    module = await makeWasm({
      global: {},
      env: {
        memory: new Memory({ initial: 10, limit: 100 }),
        table: new Table({ initial: 0, element: "anyfunc" }),
        abort: () => {
          console.error("abort in wasm!");
          throw new Error("Unsupported wasm api: abort");
        },
        require: (b) => {
          if (!b) {
            console.error("require failed");
            throw new Error("Require failed");
          }
        },
        wasm_input: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
        sha256New: sha256New,
        sha256Push: sha256Push,
        sha256Finalize: sha256Finalize
      },
    });
    console.log("module loaded", module); // "3
    /*
    WebAssembly.instantiateStreaming(makeWasm, importObject).then(
        (obj) => console.log(obj.instance.exports)
    );
    */
    instance = module.instance;
    __wbg_set_wasm(instance.exports);
    return instance.exports;
  }
}
