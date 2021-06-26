const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require('../models/usuario.model');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la aplicación",
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Look for the autenticated user and return it
        const usuario = await Usuario.findById(uid);

        // Verify if exists
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en BD",
            });
        }

        // Verify if uid is state=true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token no válido - usuario con estado: false",
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Token no válido",
        });
    }
};

module.exports = {
    validarJWT,
};