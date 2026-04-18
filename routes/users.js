const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// TODO: Implement in Week 2
// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.post('/logout', userController.logout);

router.get('/test', (req, res) => {
  res.json({ message: 'Users route - coming soon' });
});

module.exports = router;
