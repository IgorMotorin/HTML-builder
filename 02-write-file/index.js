const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');


let fullPath = path.join(__dirname, 'text.txt');
let writeStream = fs.createWriteStream(fullPath,'utf8');  
const rl = readline.createInterface({ input, output });

rl.question('Введите текст для записи в файл => "text.txt": ', (answer) => {
    if (answer == 'exit') {getExit()} else { writeStream.write(answer + '\n')}
    // writeStream.write(answer + '\n')
    rl.on('line', (input) => {        
        if (input == 'exit') {
            getExit()   
        } else {writeStream.write(input + '\n')}  
      }); 
});

rl.on('pause', () => {console.log('Процесс записи остановлен.');});
rl.on('SIGINT', () => {getExit()});

function getExit () {
    rl.question(
        'Хотите прервать процесc записи? y(es)',
        (answer) => {
            if (answer.match(/^y(es)?$/i)) {
                writeStream.end()
                rl.pause()
            };
        }
    );
}