const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi! Please, enter text: ');
process.on('exit', () => stdout.write('\nBye!'));
process.on('SIGINT', () => process.exit());

stdin.on('data', data => {
    if(data.toString().trim() === 'exit') {
        process.exit();
    }
    writeStream.write(data);
})