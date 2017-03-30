// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const os = require('os')
const crypto = require('crypto')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getRomsPath() {
    return getUserHome() + '/Desktop/roms';
}

console.log(getRomsPath());
let path = getRomsPath();

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

fs.readdir(path, (err, files) => {
    console.log(files);
    var hash = crypto.createHash('MD5');
    var filePath = path+'/'+files[0];
    console.log(filePath);
    var s = fs.createReadStream(filePath);
    s.on('data', function (d) {
        console.log(d);
        hash.update(d);
    });
    s.on('end', function () {
          var d = hash.digest('hex');
          console.log(d + '  ' + filePath);
          console.log(d);
    });

    fs.readFile(filePath, function (err, data) {
        checksum(data);         // e53815e8c095e270c6560be1bb76a65d
        console.log(checksum(data));
        checksum(data, 'sha1'); // cd5855be428295a3cc1793d6e80ce47562d23def
    });

    // document.body.innerHTML = "<p>"+files+"</p>"

});

