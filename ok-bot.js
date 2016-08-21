/* jshint esnext: true, node: true */
// An IRC bot for the k5 programming language,
// using oK from : https://github.com/JohnEarnest/ok
"use strict";

const fs = require("fs");
const irc = require('irc');
const ok = require('./lib/ok/oK');

const MAX_OUTPUT_LINES = 8;
const env = ok.baseEnv();

const runK = (src) => {
  return new Promise((resolve, reject) => {
    resolve(ok.format(ok.run(ok.parse(src), env)));
  });
};

fs.readFile("./config.json", (error, raw_data) => {
  if (error) throw error;
  const json_data = JSON.parse(raw_data);
  const client = new irc.Client(json_data.server, json_data.nickname, {
    channels: json_data.channels
  });

  client.addListener("message", (from, to, msg) => {
    if (to.startsWith("#") && msg.startsWith("k) ")) {
      runK(msg.substring(2)).then(
        (result) => {
          const lines = result.split("\n");
          const line_amount = Math.min(lines.length, MAX_OUTPUT_LINES);
          for (let i = 0; i < line_amount; ++i) {
            client.say(to, `${from}: ${lines[i]}`);
          }
          if (lines.length > MAX_OUTPUT_LINES) client.say(to, `${from}: ...`);
        },
        (err) => {
          client.say(to, `ERROR: ${err.message}`);
        }
      );
    }
  });
});
