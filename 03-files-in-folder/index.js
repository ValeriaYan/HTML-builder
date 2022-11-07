const fs = require('fs')
const path = require('path')

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
    if(err) return console.error(err.message)
    files.forEach((file) => {
        if(!file.isDirectory()) {
            fs.stat(path.join(__dirname, 'secret-folder', `${file.name}`), (err, stats) => {
                if(err) return console.error(err.message);
                console.log(file.name.split('.')[0] + ' - ' + path.extname(file.name).slice(1) + ' - ' + stats.size + ' byte');
            });
        }
    })
})