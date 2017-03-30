// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const os = require('os')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getRomsPath() {
    return getUserHome() + '/Desktop/roms';
}

console.log(getRomsPath());
let path = getRomsPath();

fs.readdir(path, (err, files) => {
    console.log(files);
    document.body.innerHTML = "<p>"+files+"</p>"
});

