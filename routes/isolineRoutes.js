const express = require('express');
const isobandController = require('../controller/analyze/isoline-analysis/isobandController');

const router = express.Router();

router
    .post('/isoband', isobandController.isoband);

module.exports = router;