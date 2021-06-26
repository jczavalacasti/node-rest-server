const { Router } = require("express");
const { check } = require("express-validator");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require("../middlewares/index");

const {
    esRolValido,
    esEmailValido,
    existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
} = require("../controllers/usuarios.controller");

const router = Router();

router.get("/", usuariosGet);

router.post(
    "/", [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser má de 6 letras").isLength({
            min: 6,
        }),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom(esEmailValido),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check("rol").custom(esRolValido), // es lo mismo a .custom( (rol) => esRolValido(rol) )
        validarCampos,
    ],
    usuariosPost
);

router.put(
    "/:id", [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosPut
);

router.delete(
    "/:id", [
        validarJWT,
        // esAdminRole,
        tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosDelete
);

module.exports = router;