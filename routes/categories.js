const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// TODO: Implement in Week 2
// Protected routes - require authentication
// router.get('/', isAuthenticated, categoryController.getAllCategories);
// router.get('/:id', isAuthenticated, categoryController.getCategoryById);
// router.post('/', isAuthenticated, categoryController.createCategory);
// router.put('/:id', isAuthenticated, categoryController.updateCategory);
// router.delete('/:id', isAuthenticated, categoryController.deleteCategory);

router.get('/test', (req, res) => {
  res.json({ message: 'Categories route - coming soon' });
});

module.exports = router;
