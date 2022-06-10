const router = require('express').Router();
const {httpRegisterUser, httpLoginUser} = require('../controllers/auth.controller');

/**
 * Registers users 
 * 
 * POST /api/users/register
 * BODY {User Schema Object} -> IMPORT ../model/
 * CONTROLLER -> ../controller/auth.controller.js
 * IDEAL RESPONSE - 201 OK
 */
router.post('/register', httpRegisterUser);
router.post('/login', httpLoginUser);

module.exports = router;