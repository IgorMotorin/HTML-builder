
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');


// console.log('Start =>')

async function mergeStyle(src, dist) {
    // await fsp.mkdir(dist).catch(err => console.error(err));
    const entries = await fsp.readdir(src, {withFileTypes: true});
    let distPath = path.join(dist, 'bundle.css');
    let writeStream = fs.createWriteStream(distPath);
    
    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const parsePath = path.parse(srcPath);     
        const stats = await fsp.stat(srcPath);    
        if(entry.isFile()) {           

            if (parsePath.ext == '.css') {
                let readableStream = fs.createReadStream(srcPath);                
                await readableStream.on('data', function (chunk) {
                      writeStream.write(chunk)                    
                });
            }
        }        
    }
}

let src = path.join(__dirname, 'styles')
let dist = path.join(__dirname, 'project-dist')
mergeStyle(src, dist);


// src = path.join(__dirname, 'test-files', 'styles')
// dist = path.join(__dirname, 'project-dist1')
// mergeStyle(src, dist);
