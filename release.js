/**
 * Created by tapathan on 1/9/2016.
 */
var fs = require('fs');
var p = require('path');
var moment = require('moment');
var archiver = require('archiver');

var versionDate = moment().format('[-]YYYYMMDDHHmmssSSS');

var environment = process.argv[2];

if (typeof environment === 'undefined') {
  console.log("Environment paramenter is required. Usage node release.js <environment stg|prod> <clientname>");
  process.exit();
}

var subsystem = (typeof process.argv[3] !== 'undefined') ? ('-' + process.argv[3]) : '';

var output = fs.createWriteStream(__dirname + '/powerme' + subsystem + versionDate + '.tar.gz');
var archive = archiver('tar', {
  gzip: true,
  gzipOptions: {
    level: 1
  }
});

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

var dist = __dirname + '/dist';

var files = [__dirname + '/Saml.js'];

for (var i in files) {
  archive.file(files[i], {name: p.basename(files[i])});
}

archive.glob('*.{crt,pem,key}', {cwd: __dirname + '/env/' + environment});

archive
  .directory(__dirname + "/node_modules/express", "node_modules/express")
  .directory(__dirname + "/node_modules/body-parser", "node_modules/body-parser")
  .directory(__dirname + "/node_modules/saml2-js", "node_modules/saml2-js")
  .directory(__dirname + "/node_modules/eventemitter3", "node_modules/eventemitter3")
  .directory(__dirname + "/node_modules/http-proxy", "node_modules/http-proxy")
  .directory(__dirname + "/node_modules/requires-port", "node_modules/requires-port")
  .directory(dist, "dist")
  .finalize();
