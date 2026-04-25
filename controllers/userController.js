const pool = require('../db');
const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required',
          code: 400
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Passwords do not match',
          code: 400
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          status: 'error',
          message: 'Password must be at least 6 characters',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      // Check if user already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser.length > 0) {
        await connection.release();
        return res.status(400).json({
          status: 'error',
          message: 'Username or email already exists',
          code: 400
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, 'user']
      );

      await connection.release();

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        userId: result.insertId,
        code: 201
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during registration',
        code: 500
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      // Find user
      const [users] = await connection.execute(
        'SELECT id, username, password, role FROM users WHERE username = ?',
        [username]
      );

      await connection.release();

      if (users.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password',
          code: 401
        });
      }

      const user = users[0];

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password',
          code: 401
        });
      }

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        status: 'success',
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        code: 200
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during login',
        code: 500
      });
    }
  },

  logout: (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            message: 'Could not log out',
            code: 500
          });
        }

        res.json({
          status: 'success',
          message: 'Logout successful',
          code: 200
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during logout',
        code: 500
      });
    }
  }
};
