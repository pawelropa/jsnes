// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const os = require('os')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getRomsPath() {
    return os.homedir + '/Desktop/roms';
}

console.log(getRomsPath())


