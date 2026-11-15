const express = require('express');
const router = express.Router();
const { stockOut } = require('../controllers/stockoutControlers');
const { authenticateJWT, authorizeRoles } = require('../Middleware/authMiddleware');

router.post('/out', authenticateJWT, authorizeRoles('admin', 'manager'), stockOut);

module.exports = router;
