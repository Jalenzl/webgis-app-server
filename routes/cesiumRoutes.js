const express = require('express');
const interpolationController = require('../controller/cesium/interpolation/interpolationController');

const router = express.Router();

router
    .post('/interpolation', interpolationController.cesiumInterp)

module.exports = router;