const dbValidators = require('./db-validators');
const generateJWT = require('./generar-jwt');
const uploadFiles = require('./upload-files');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...uploadFiles
};