const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares/");
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
} = require("../controllers/categorias");

const { existeCategoria } = require("../helpers/db-validators");

const router = Router();
/**
 * {{url}}/api/categorias
 **/

// Get all categories
router.get("/", obtenerCategorias);

// Get especific category
router.get(
    "/:id", [
        check("id", "No es un id de MongoDB válido").isMongoId(),
        check("id").custom(existeCategoria),
        validarCampos,
    ],
    obtenerCategoria
);

// Create new category - only with valid token
router.post(
    "/", [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    crearCategoria
);

// Update - private - with valid token
router.put(
    "/:id", [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("id").custom(existeCategoria),
        validarCampos,
    ],
    actualizarCategoria
);

// Delete category - only Admin
router.delete(
    "/:id", [
        validarJWT,
        esAdminRole,
        check("id", "No es un id de MongoDB válido").isMongoId(),
        check("id").custom(existeCategoria),
        validarCampos,
    ],
    borrarCategoria
);

module.exports = router;