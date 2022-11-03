const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');


console.log('Start =>')

async function saveTemplate (template, dist, comp) {
    let temp = '';  
    let readableStream = fs.createReadStream(template, 'utf-8');
    await fsp.mkdir(dist).catch(err => console.error(err));
    let distPath = path.join(dist, 'index.html');
    let writeStream = fs.createWriteStream(distPath);

  readableStream.on('data', async function (chunk) {    
    temp = await replaceAsync(chunk)
    writeStream.write(temp)    
  });
}


async function replaceAsync(str) {
    let regex = new RegExp('{{.+?}}', 'g')
    const matches = str.match(regex);
    let comp = path.join(__dirname, 'components')
    
    if (matches) {
        let itemComp = matches[0].slice(2, -2);
        const replacement = await readComponent(comp, itemComp)
        str = str.replace(matches[0], replacement);
        str = await replaceAsync(str);
    }    
    return str;
}


async function readComponent(comp, itemComp) {   
    const entries = await fsp.readdir(comp, {withFileTypes: true});    
    for(let entry of entries) {
        const srcPath = path.join(comp, entry.name);
        const parsePath = path.parse(srcPath);     
        const stats = await fsp.stat(srcPath);
        let readableStream = fs.createReadStream(srcPath, 'utf-8');  
        if(entry.isFile())  {
            if (parsePath.ext == '.html' && parsePath.name == itemComp) {             
                for await (const chunk of readableStream) {return chunk}
            }
        }        
    }    
}



async function mergeStyle(src, dist) {
    const entries = await fsp.readdir(src, {withFileTypes: true});
    let distPath = path.join(dist, 'style.css');
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


async function copyDirectory (src, dest) {    

    await delFile(dest)
    await delDir(dest)
    await copyDir(src, dest);

}



const template = path.join(__dirname, 'template.html'); // файл шаблона
const dist = path.join(__dirname, 'project-dist'); // папка для сборки
const comp = path.join(__dirname, 'components'); //папка с компонентами
const src = path.join(__dirname, 'styles');    //папка со стилями
const srcAssets = path.join(__dirname, 'assets');  //папка с ресурсами
const dest = path.join(__dirname, 'project-dist', 'assets'); //копировать ресурсы

saveTemplate (template, dist, comp);
mergeStyle(src, dist);
copyDirectory(srcAssets, dest);