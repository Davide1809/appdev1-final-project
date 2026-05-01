const pool = require('../db');

module.exports = {
  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      const [users] = await connection.execute(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );

      await connection.release();

      res.json({
        status: 'success',
        data: users,
        count: users.length,
        code: 200
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Get user by ID (admin only)
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();

      const [users] = await connection.execute(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [id]
      );

      await connection.release();

      if (users.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 404
        });
      }

      res.json({
        status: 'success',
        data: users[0],
        code: 200
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Promote user to admin (admin only)
  promoteToAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.session.userId;

      if (id == adminId) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot change your own role',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 404
        });
      }

      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        ['admin', id]
      );

      await connection.release();

      res.json({
        status: 'success',
        message: 'User promoted to admin',
        code: 200
      });
    } catch (error) {
      console.error('Promote user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Demote admin to user (admin only)
  demoteToUser: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.session.userId;

      if (id == adminId) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot change your own role',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 404
        });
      }

      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        ['user', id]
      );

      await connection.release();

      res.json({
        status: 'success',
        message: 'User demoted to regular user',
        code: 200
      });
    } catch (error) {
      console.error('Demote user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Get all products (admin - view all, not just own) (admin only)
  getAllProducts: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      const [products] = await connection.execute(
        `SELECT p.id, p.name, p.description, p.category_id, p.quantity, p.price,
                c.name as category_name, u.username as created_by_username, p.created_by, p.created_at
         FROM products p
         JOIN categories c ON p.category_id = c.id
         JOIN users u ON p.created_by = u.id
         ORDER BY p.created_at DESC`
      );

      await connection.release();

      res.json({
        status: 'success',
        data: products,
        count: products.length,
        code: 200
      });
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Get all categories (admin - view all, not just own) (admin only)
  getAllCategories: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      const [categories] = await connection.execute(
        `SELECT c.id, c.name, c.description, u.username as created_by_username, c.created_by, c.created_at
         FROM categories c
         JOIN users u ON c.created_by = u.id
         ORDER BY c.created_at DESC`
      );

      await connection.release();

      res.json({
        status: 'success',
        data: categories,
        count: categories.length,
        code: 200
      });
    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Delete any user (admin only) - CASCADE delete their data
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.session.userId;

      if (id == adminId) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete your own account',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 404
        });
      }

      // Delete user (CASCADE will delete their products/categories)
      await connection.execute('DELETE FROM users WHERE id = ?', [id]);

      await connection.release();

      res.json({
        status: 'success',
        message: 'User deleted successfully',
        code: 200
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  // Get admin dashboard stats (admin only)
  getDashboardStats: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
      const [categoryCount] = await connection.execute('SELECT COUNT(*) as count FROM categories');
      const [adminCount] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");

      await connection.release();

      res.json({
        status: 'success',
        data: {
          totalUsers: userCount[0].count,
          totalAdmins: adminCount[0].count,
          totalProducts: productCount[0].count,
          totalCategories: categoryCount[0].count
        },
        code: 200
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  }
};
