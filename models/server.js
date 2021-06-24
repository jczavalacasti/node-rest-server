const express = require("express");
const cors = require('cors');

const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos'
        };

        //Connect to DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Routes application
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // read and convert body
        this.app.use(express.json());

        // PUBLIC DIR
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }



    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto ", this.port);
        });
    }
}

module.exports = Server;