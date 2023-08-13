const { Generator, Sha256Context, sha256New, sha256Push, sha256Finalize } = require('../hostapi.js');

const initCursor = 0, initValue = [];
const initGen = new Generator(initCursor, initValue);
const sha256NewSize = 8;
// bytes of message is 8
const messageSize = 8;
// 2 ^ 63 - 1
const message = 9223372036854775807;
const initHasher = undefined;
const initSize = 0;
var sha256Context = new Sha256Context(initHasher, initGen, initSize);
const expectedGen = new Generator(1, [15811479648672806936n, 18323077828191991038n, 10361445006139218883n, 6374347445474471398n]);

function sha256NewTest() {
  sha256New(sha256Context, sha256NewSize);
 
  if(!sha256Context.hasher) {
    console.error("Error: hasher should not be undefined");
  } else if(JSON.stringify(sha256Context.generator) != JSON.stringify(initGen)) {
    console.error("Error: generator is not initial value");
  } else if(sha256Context.size != sha256NewSize) {
    console.error("Error: size is not initial value");
  } else {
    console.log("sha256New Test PASSED");
  }
}

function sha256PushTest() {
  sha256Push(sha256Context, message);

  // if you push message again, _nDataBytes == 2 * messageSize
  if(sha256Context.hasher._nDataBytes != messageSize) {
    console.error("Error: data bytes is wrong");
  } else if(JSON.stringify(sha256Context.generator) != JSON.stringify(initGen)) {
    console.error("Error: generator is not initial value");
  } else if(sha256Context.size != 0) {
    console.error("Error: size shoule be (previous size - 8)");
  } else {
    console.log("sha256Push Test PASSED");
  }
}

function sha256FinalizeTest() {
  sha256Finalize(sha256Context);

  if(sha256Context.hasher) {
    console.error("Error: hasher should be undefined");
  } else if(sha256Context.generator.values.toString() != expectedGen.values.toString()) {
    console.error("Error: generator values is wrong");
  } else if(sha256Context.generator.cursor != expectedGen.cursor) {
    console.error("Error: generator cursor is wrong");
  } else if(sha256Context.size != 0) {
    // sha256NewSize - messageSize * push times = 0
    console.error("Error: size shoule be 0");
  } else {
    console.log("sha256Finalize Test PASSED");
  }
}

function main() {
  console.log("========================== Testing sha256New ==========================");
  sha256NewTest();

  console.log("========================== Testing sha256Push ==========================");
  sha256PushTest();

  console.log("========================== Testing sha256Finalize ==========================");
  sha256FinalizeTest();
}

main();
