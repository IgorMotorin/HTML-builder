const fs = require('fs');
const path = require('path');

  let fullPath = path.join(__dirname, 'text.txt');
  let readableStream = fs.createReadStream(fullPath,'utf8');

  readableStream.on('data', function (chunk) {
    console.log('=>', chunk);
  });