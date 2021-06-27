const { Router } = require("express");
const { check } = require("express-validator");

const { coleccionesPermitidas } = require("../helpers");
const {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
} = require("../controllers/uploads.controller");

const { validarCampos, validarArchivoSubir } = require("../middlewares");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
    "/:coleccion/:id", [
        validarArchivoSubir,
        check("id", "El id debe ser de MongoDB").isMongoId(),
        check("coleccion").custom((col) =>
            coleccionesPermitidas(col, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    // actualizarImagen
    actualizarImagenCloudinary
);

router.get(
    "/:coleccion/:id", [
        check("id", "El id debe ser de MongoDB").isMongoId(),
        check("coleccion").custom((col) =>
            coleccionesPermitidas(col, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    mostrarImagen
);

module.exports = router;