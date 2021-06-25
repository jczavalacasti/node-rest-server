const path = require('path');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');

const cargarArchivo = (req, res = response) => {

    // The name and file has to be in the request 
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: 'Sin archivo que subir' });
        return;
    }

    const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validate extention
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            msg: `La extensión ${ extension } no es permitida, solo: ${extensionesValidas}`
        });
    }

    const nombreTemp = uuidv4() + '.' + extension;
    uploadPath = path.join(__dirname, '../uploads/', nombreTemp);

    archivo.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).json({ err });
        }

        res.json({ msg: 'El archivo se subiio al path: ' + uploadPath });
    });

};


module.exports = {
    cargarArchivo
};