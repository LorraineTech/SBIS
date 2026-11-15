const express = require('express');
const router = express.Router();
const { stockIn } = require('../controllers/stockControllers');
const { authenticateJWT, authorizeRoles } = require('../Middleware/authMiddleware');

router.post('/in', authenticateJWT, authorizeRoles('admin', 'manager'), stockIn);

module.exports = router;
