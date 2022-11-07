const fs = require('fs');
const path = require('path')

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if(err) return console.log(err.message);
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'))
    files.forEach((file) => {
        if(path.extname(file.name) == '.css' && file.isDirectory()) {
            const input = fs.createReadStream(path.join(path.join(__dirname), 'styles', `${file.name}`), 'utf-8');
            input.on('data', chunk => output.write(chunk));
            input.on('error', err => console.log(err.message))
        }
    })
})