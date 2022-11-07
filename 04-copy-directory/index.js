const fs = require('fs');
const path = require('path')

function copyDir() {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
        if(err) return console.error(err.message);
        fs.readdir(path.join(__dirname, 'files'), (err, files) => {
            for(let i = 0; i < files.length; i++) {
                fs.promises.copyFile(path.join(__dirname, 'files', `${files[i]}`), path.join(__dirname, 'files-copy', `${files[i]}`))
            }
            fs.readdir(path.join(__dirname, 'files-copy'), (err, filesCopy) => {
                for(let i = 0; i < filesCopy.length; i++) {
                    if(!files.includes(filesCopy[i])) {
                        fs.unlink(path.join(__dirname, 'files-copy', `${filesCopy[i]}`), err => {
                            if(err) return console.error(err.message)
                        })

                    }
                }
            })
        })
    })
}

copyDir();