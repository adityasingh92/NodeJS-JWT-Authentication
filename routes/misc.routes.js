const router = require('express').Router();
const httpGetProtectedContent = require('../controllers/misc.controller');

router.get('/safe', httpGetProtectedContent);

module.exports = router;