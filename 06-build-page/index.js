const fs = require('fs');
const path = require('path');

async function createDist() {
    fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, err => {
        if(err) return console.error(err.message);
    });
}


// оно через раз работает, я уже не могу D:
async function replaceTemplate() {
    await createDist();
    fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
        if(err) return console.error(err.message);
        let template = data;
        
        fs.readdir(path.join(__dirname, 'components'), (err, files) => {

            files.forEach((file) => {
                let componentString = `{{${file.split('.')[0]}}}`;
                if(template.includes(componentString)) {
                    const streamInput = fs.createReadStream(path.join(__dirname, 'components', `${file}`));
                    let data = '';
                    streamInput.on('data', chunk => data += chunk);
                    streamInput.on('end', () => {
                        template = template.replace(componentString, data);
                        const streamOutput = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                        streamOutput.write(template)
                    });
                }
            })
        })
    })
}

async function createStyle() {
    fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
        if(err) return console.log(err.message);
        const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'))
        files.forEach((file) => {
            if(path.extname(file.name) == '.css' && !file.isDirectory()) {
                const input = fs.createReadStream(path.join(path.join(__dirname), 'styles', `${file.name}`), 'utf-8');
                input.on('data', chunk => output.write(chunk));
                input.on('error', err => console.log(err.message))
            }
        })
    })
}


async function copyFiles(fromPath, toPath) {
    fs.mkdir(toPath, {recursive: true}, err => {
        if(err) return console.error(err.message);
        fs.readdir(fromPath,{withFileTypes: true}, (err, files) => {
            for(let i = 0; i < files.length; i++) {
                if(!files[i].isDirectory()) {
                    fs.promises.copyFile(path.join(fromPath, `${files[i].name}`), path.join(toPath, `${files[i].name}`))
                }else {
                    copyFiles(path.join(fromPath, `${files[i].name}`), path.join(toPath, `${files[i].name}`))
                }
            }
            fs.readdir(toPath,{withFileTypes: true}, (err, filesCopy) => {
                for(let i = 0; i < filesCopy.length; i++) {
                    if(!files.find((item) => item.name == filesCopy[i].name)) {
                        if(!filesCopy[i].isDirectory()) {
                            fs.unlink(path.join(toPath, `${filesCopy[i].name}`), err => {
                                if(err) return console.error(err.message)
                            })
                        }else {
                            deleteFolder(path.join(toPath, `${filesCopy[i].name}`));
                        }
                    }
                }
            })
        })
    })
}

async function deleteFolder(pathFolder) {
    fs.readdir(pathFolder, {withFileTypes: true}, (err, files) => {
        for(let i = 0; i < files.length; i++) {
            if(!files[i].isDirectory()) {
                fs.unlink(path.join(pathFolder, `${files[i].name}`), err => {
                    if(err) return console.error(err.message)
                })
            }else {
                deleteFolder(path.join(pathFolder, `${files[i].name}`));
            }
        }
        fs.rmdir(pathFolder, err => {
            if(err) return console.error(err.message);
        })
    })
}

function createProjectDist() {
    createDist();
    replaceTemplate();
    replaceTemplate(); 
    copyFiles(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    createStyle();
}

createProjectDist()
