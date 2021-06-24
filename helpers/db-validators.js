const {
    Categoria,
    Role,
    Usuario,
    Producto
} = require("../models");

// If it's empty, set default value
const esRolValido = async(rol = "") => {
    const existeRol = await Role.findOne({ rol });
    // console.log(existeRol);

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
};

const esEmailValido = async(correo = "") => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado.`);
    }
};

/**
 * Validate if user exists on DB
 */
const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
};

/**
 * Validate if category exists on DB
 */
const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria con Id ${id} no existe`);
    }
};

/**
 * Validate if category exists on DB
 */
const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con Id ${id} no existe`);
    }
};

module.exports = {
    esRolValido,
    esEmailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
};