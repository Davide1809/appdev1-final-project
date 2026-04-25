const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const productController = require('../controllers/productController');

// Protected routes - require authentication
router.get('/', isAuthenticated, productController.getAllProducts);
router.get('/:id', isAuthenticated, productController.getProductById);
router.post('/', isAuthenticated, productController.createProduct);
router.put('/:id', isAuthenticated, productController.updateProduct);
router.delete('/:id', isAuthenticated, productController.deleteProduct);

module.exports = router;
