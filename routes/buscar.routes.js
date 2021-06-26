const { Router } = require("express");

const { buscar } = require('../controllers/buscar.controller');

const router = Router();

router.get('/:coleccion/:termino', buscar);

router.get('/:coleccion', buscar);

module.exports = router;