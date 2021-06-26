const { response } = require("express");

const validarArchivoSubir = (req, res = response, next) => {


    // Verify, the name and file has to be in the request
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: "Sin archivo que subir"
        });
    }

    next();

};

module.exports = {
    validarArchivoSubir
};