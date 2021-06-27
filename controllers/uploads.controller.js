const path = require('path');
const fs = require('fs');

// CLOUDINARY
var cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

// EXPRESS
const { response } = require("express");

// VALIDATORS
const { subirArchivos } = require("../helpers");

// MODELS
const {
    Usuario,
    Producto
} = require('../models/index.model');

const cargarArchivo = async(req, res = response) => {

    try {

        /*
         * 1° Files from request, 
         * 2° valid extentions or put undefined to let defaults extentions, 
         * 3° folder
         */
        const nombre = await subirArchivos(req.files, ["txt", "md"], 'textos');
        res.json({ nombre });

    } catch (error) {
        res.status(400).json({ error });
    }
};

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto :('
            });
    }

    // Clean img
    if (modelo.img) {
        // Delete img from server
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivos(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();


    res.json({ modelo });

};

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto :('
            });
    }

    // Clean img
    if (modelo.img) {
        // Delete img from server
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // If there's no image, return default image
    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathNoImage);
};


const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto :('
            });
    }

    // Delete IMG if already uploaded one before
    if (modelo.img) {
        // "https://res.cloudinary.com/dyhigm5z4/image/upload/v1624756516/cexgkhxjuzyuvwrxatmw.png"
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    // Returns a promise -> so await
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
    res.json({ modelo });

};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};