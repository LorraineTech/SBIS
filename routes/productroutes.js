const express = require('express');
const router = express.Router();
const {
    addProduct,
    getInventory,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControlers');
const { authenticateJWT, authorizeRoles } = require('../Middleware/authMiddleware');

router.post('/add', authenticateJWT, authorizeRoles('admin', 'manager'), addProduct);
router.get('/get', authenticateJWT, getInventory);
router.get('/get/:id', authenticateJWT, getProduct);
router.put('/update/:id', authenticateJWT, authorizeRoles('admin', 'manager'), updateProduct);
router.delete('/delete/:id', authenticateJWT, authorizeRoles('admin'), deleteProduct);

module.exports = router;
