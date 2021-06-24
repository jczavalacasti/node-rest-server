const { Router } = require("express");
const { check } = require("express-validator");

const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require("../controllers/productos");

const {
    validarJWT,
    validarCampos,
    esAdminRole
} = require("../middlewares");

const {
    existeProductoPorId,
    existeCategoriaPorId,
} = require("../helpers/db-validators");

const router = Router();

/**
 * /api/productos
 */

// Get all products
router.get("/", obtenerProductos);

//  Get especific product
router.get(
    "/:id", [
        check("id", "No es un id de MongoDB válido").isMongoId(),
        check("id").custom(existeProductoPorId),
        validarCampos,
    ],
    obtenerProducto
);

// Create a new product
router.post(
    "/", [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("categoria", "No es un Id de MongoDB").isMongoId(),
        check("categoria").custom(existeCategoriaPorId),
        check("descripcion", "La descripción es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    crearProducto
);

// Update a product
router.put(
    "/:id", [
        validarJWT,
        // check("categoria", "No es un Id de MongoDB").isMongoId(),
        check("id").custom(existeProductoPorId),
        validarCampos,
    ],
    actualizarProducto
);

// Delete a product
router.delete(
    "/:id", [
        validarJWT,
        esAdminRole,
        check("id", "No es un id de MongoDB válido").isMongoId(),
        check("id").custom(existeProductoPorId),
        validarCampos
    ],
    borrarProducto
);

/*
Without Separate controller 
router.post("/", [], (req, res) => {
    res.json("post - prod");
 });
 */

module.exports = router;