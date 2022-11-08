const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

// console.log('Start =>')

async function copyDir(src,dest) {
    const entries = await fsp.readdir(src, {withFileTypes: true});
    
    await fsp.mkdir(dest).catch(err => console.error(err));

    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fsp.copyFile(srcPath, destPath);
        }
    }
}

async function delFile(dest) {
    await fsp.mkdir(dest).catch(err => console.error(err));
    const entries = await fsp.readdir(dest, {withFileTypes: true});

    for(let entry of entries) {       
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await delFile(destPath);
        } else {
            await fsp.unlink(destPath);
        }
    }
}

async function delDir(dest) {
    const entries = await fsp.readdir(dest, {withFileTypes: true});

    for(let entry of entries) {       
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await delDir(destPath);            
        } 

        await fsp.rmdir(destPath).catch(err => console.error(err));
        
    }
}


async function copyDirectory () {
    const src = path.join(__dirname, 'files')
    const dest = path.join(__dirname, 'files-copy')

    await delFile(dest)
    await delDir(dest)
    await copyDir(src, dest);

}

copyDirectory();