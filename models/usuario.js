// {
//     nombre: '',
//     correo; ''
//     password: '',
//     img: '',
//     rol: '',
//     estado: false,
//     google: true,    
// }

const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        unique: true
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function() {
    // extract the params that I want to exclude and send the rest on the final argument
    const { __v, password, _id, ...usuario } = this.toObject();

    // Change the name of a parameter that is gonna show on the response 
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuarios', UsuarioSchema);