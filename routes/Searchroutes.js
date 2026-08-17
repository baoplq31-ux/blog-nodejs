const express = require('express');
const router = express.Router();
const SiteController = require('../app/controllers/SiteController');

router.get('/search', SiteController.search);

module.exports = router;