const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async(termino = "", res = response) => {
    // Check if Id is a MongoDB ID
    if (validateMongoId(termino, res)) {
        const usuario = await Usuario.findById(termino);

        const result = {
            results: usuario ? [usuario] : [],
        };

        return res.json(result);
    }

    // Look for name
    const regex = new RegExp(termino, "i");
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }],
    });
    res.json({
        results: usuarios,
    });
};

const buscarCategorias = async(termino = "", res = response) => {
    // Check if Id is a MongoDB ID
    if (validateMongoId(termino, res)) {
        const categoria = await Categoria.findById(termino);

        const result = {
            results: categoria ? [categoria] : [],
        };

        return res.json(result);
    }

    // Look for category
    const regex = new RegExp(termino, "i");
    const categorias = await Categoria.find({ nombre: regex, estado: true });
    res.json({
        results: categorias,
    });
};

const buscarProductos = async(termino = "", res = response) => {

    // Check if Id is a MongoDB ID
    if (validateMongoId(termino, res)) {
        const producto = await Producto.findById(termino).populate(
            "categoria",
            "nombre"
        );

        const result = {
            results: producto ? [producto] : [],
        };

        return res.json(result);
    }

    // Look for category
    const regex = new RegExp(termino, "i");
    const productos = await Producto.find({
        nombre: regex,
        estado: true,
    }).populate("categoria", "nombre");
    res.json({
        results: productos,
    });
};

const productosPorCategoria = async(term = "", res = response) => {

    if (validateMongoId(termino, res)) {
        const category = await Categoria.findById(term);
        return res.json({
            results: (category) ? [category] : []
        })
    }
    const regex = RegExp(term, 'i'); //sera una busqueda insensible (no estricta)
    if (term === '') {
        res.json({
            msg: 'Debe ingresar una búsqueda'
        })
    }
    const category = await Categoria.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    })
    if (!category[0]) {
        return res.status(400).json({
            msg: 'Esta categoría no existe'
        })
    }
    const products = await Producto.find({ category: category[0]._id }).populate('category', 'name').populate('user', 'name')
    if (!products[0]) {
        return res.status(400).json({
            msg: 'No se encontraron productos'
        })
    }
    res.json({
        results: products
    })
};

const validateMongoId = (termino = '', res = response) => {
    if (termino === '') {
        return res.json({
            msg: 'Debe ingresar una búsqueda'
        });
    } else {

        return ObjectId.isValid(termino);
    }
};

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las coleciones permitidas son: ${coleccionesPermitidas}`,
        });
    }

    switch (coleccion) {
        case "usuarios":
            buscarUsuarios(termino, res);
            break;
        case "categorias":
            buscarCategorias(termino, res);
            break;
        case "productos":
            buscarProductos(termino, res);
            break;
        case "productosPorCategoria":
            productosPorCategoria(termino, res);
            break;
        default:
            res.status(500).json({
                msg: "Se le olvido hacer esta búsqueda",
            });
    }
};

module.exports = {
    buscar,
};