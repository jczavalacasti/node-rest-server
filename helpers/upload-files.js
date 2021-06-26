const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensiones = ['png', 'jpg', 'jpeg', 'gif'];

const subirArchivos = (files, extensionesValidas = extensiones, folder = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validate extention        
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${ extension } no es permitida, solo: ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', folder, nombreTemp);

        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });
    });
};

module.exports = {
    subirArchivos
};