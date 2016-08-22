/* jshint esnext: true, node: true */
"use strict";

const ok = require("./lib/ok/oK");

const env = ok.baseEnv();
const runK = (src) => {
  return ok.format(ok.run(ok.parse(src), env));
};

if (process.argv[2] !== undefined) {
  let result;
  try {
    result = runK(process.argv[2]);
  } catch (err) {
    result = `ERROR: ${err.message}`;
  }
  console.log(result);
}
