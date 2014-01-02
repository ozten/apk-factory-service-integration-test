#!/usr/bin/env node

/* rm -Rf /tmp/apk-cache cache/
curl 'http://localhost:8080/application.apk?manifestUrl=http://people.mozilla.org/~fdesre/openwebapps/package.manifest' > t && file t;
curl 'http://localhost:8080/application.apk?manifestUrl=http://deltron3030.testmanifest.com/manifest.webapp' > t && file t
curl 'http://localhost:8080/application.apk?manifestUrl=http://people.mozilla.org/~fdesre/openwebapps/package.manifest' > t && file t
curl 'http://localhost:8080/application.apk?manifestUrl=http://deltron3030.testmanifest.com/manifest.webapp' > t && file t
*/

var exec = require('child_process').exec
var request = require('request');

var fs = require('fs.extra');
var Step = require('step');

function makeUrl(manifestUrl) {
  return 'http://localhost:8080/application.apk?manifestUrl=' + 
    encodeURIComponent(manifestUrl);
}

function checkError(err) {

    if (err) {
      console.error('[ERR][', err, ']');
      process.exit(1);
    }
}

function testFile(stdout, stderr, cb) {
  if (stderr === '') {
      if (stdout.trim() === 't: Zip archive data, at least v2.0 to extract') {
        cb();
      } else {
        checkError('stdout did not match expected [' + stdout + ']');
      }
    } else {
      checkError('stderr was not empty on curl1 ' + stderr);
    }
}

Step(
  function rmCache() {
    fs.rmrf('/tmp/apk-cache', this);
  },

  function curl1(err) {
    checkError(err);
    var r = request(makeUrl('http://people.mozilla.org/~fdesre/openwebapps/package.manifest')).pipe(fs.createWriteStream('t'));
    r.on('close', this);
  },
  function afterCurl1(err) {
    checkError(err);
    exec("file t", this);
  },
  function afterCurl1File(err, stdout, stderr) {
    checkError(err);
    testFile(stdout, stderr, this);
  },
  
  function curl2(err) {
    checkError(err);
    var r = request(makeUrl('http://deltron3030.testmanifest.com/manifest.webapp')).pipe(fs.createWriteStream('t'));
    r.on('close', this);
  },
  function afterCurl2(err) {
    checkError(err);
    exec("file t", this);
  },
  function afterCurl2File(err, stdout, stderr) {
    checkError(err);
    testFile(stdout, stderr, this);
  },

  function curl3(err) {
    checkError(err);
    var r = request(makeUrl('http://people.mozilla.org/~fdesre/openwebapps/package.manifest')).pipe(fs.createWriteStream('t'));
    r.on('close', this);
  },
  function afterCurl3(err) {
    checkError(err);
    exec("file t", this);
  },
  function afterCurl3File(err, stdout, stderr) {
    checkError(err);
    testFile(stdout, stderr, this);
  },
  
  function curl4(err) {
    checkError(err);
    var r = request(makeUrl('http://deltron3030.testmanifest.com/manifest.webapp')).pipe(fs.createWriteStream('t'));
    r.on('close', this);
  },
  function afterCurl4(err) {
    checkError(err);
    exec("file t", this);
  },
  function afterCurl4File(err, stdout, stderr) {
    checkError(err);
    testFile(stdout, stderr, this);
  },

  function finish() {
    console.log('[OK]');
  }

);