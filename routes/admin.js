const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/adminController');

// All admin routes require authentication AND admin role

// User management
router.get('/users', isAdmin, adminController.getAllUsers);
router.get('/users/:id', isAdmin, adminController.getUserById);
router.put('/users/:id/promote', isAdmin, adminController.promoteToAdmin);
router.put('/users/:id/demote', isAdmin, adminController.demoteToUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// View all data (regardless of owner)
router.get('/products', isAdmin, adminController.getAllProducts);
router.get('/categories', isAdmin, adminController.getAllCategories);

// Dashboard
router.get('/dashboard/stats', isAdmin, adminController.getDashboardStats);

module.exports = router;
