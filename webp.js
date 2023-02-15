const {execFileSync} = require('child_process');
const cwebp = require('cwebp-bin');
const fs = require('fs'); 
const path = require('path');
const pathName = path.resolve(__dirname, 'src/images/');
fs.readdir(pathName, function(err, files){
    files.forEach(filePath => {
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        execFileSync(cwebp, [`${pathName}/${filePath}`, '-o', `${pathName}/${name}.webp`])
    })
});

