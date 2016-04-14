// An IRC bot for the k5 programming language,
// using oK from : https://github.com/JohnEarnest/ok
"use strict";
var irc = require('irc');
var ok = require('./lib/ok/oK');

const MAXLINES = 8;

var client = new irc.Client('irc.freenode.net', 'ok-bot', {
  channels: ['#jsoftware', '#learnprogramming', '#kq']
});

var env = ok.baseEnv();

function runK(src) {
  return ok.format(ok.run(ok.parse(src), env));
}


client.addListener('message', (from, to, msg)=> {
  if (to.startsWith('#') && msg.startsWith('k) ')) {
    var result;
    try { result = runK(msg.substring(2)); }
    catch (err) { result = 'ERROR: ' + err.message; }
    var line, lines = result.split("\n");
    for (var i=0; i<lines.length; i++) {
      if (i >= MAXLINES && lines.length != MAXLINES) {
        line = '...';
        break;
    } else line = lines[i];
      client.say(to, `${from}: ${line}`);
    }
  }
});
