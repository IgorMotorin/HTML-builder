const fsp = require('fs').promises;
const path = require('path');

console.log('Start =>')

async function showDir(src) {
    const entries = await fsp.readdir(src, {withFileTypes: true});
    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const parsePath = path.parse(srcPath);     
        const stats = await fsp.stat(srcPath);    
        if(entry.isFile()) {
            console.log("file info =>", parsePath.name + ' - ' + parsePath.ext.slice(1) + ' - ' + Number(stats.size) /1000 + 'kb')
        }
    }
}

const src = path.join(__dirname, 'secret-folder')
showDir(src);

