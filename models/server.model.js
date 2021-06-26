const express = require("express");
const cors = require('cors');
const fileupload = require('express-fileupload');

const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
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

        // Fileupload
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true // let create folders
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }



    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto ", this.port);
        });
    }
}

module.exports = Server;