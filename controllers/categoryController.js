const pool = require('../db');

module.exports = {
  getAllCategories: async (req, res) => {
    try {
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Get all categories for the authenticated user
      const [categories] = await connection.execute(
        `SELECT id, name, description, created_at, updated_at
         FROM categories
         WHERE created_by = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      await connection.release();

      res.json({
        status: 'success',
        data: categories,
        count: categories.length,
        code: 200
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Get category by ID
      const [categories] = await connection.execute(
        `SELECT id, name, description, created_by, created_at, updated_at
         FROM categories
         WHERE id = ?`,
        [id]
      );

      await connection.release();

      if (categories.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found',
          code: 404
        });
      }

      const category = categories[0];

      // Check ownership
      if (category.created_by !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to access this category',
          code: 403
        });
      }

      res.json({
        status: 'success',
        data: category,
        code: 200
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const userId = req.session.userId;

      // Validation
      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      // Insert category
      const [result] = await connection.execute(
        `INSERT INTO categories (name, description, created_by) 
         VALUES (?, ?, ?)`,
        [name, description || null, userId]
      );

      await connection.release();

      res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        categoryId: result.insertId,
        code: 201
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Check if category exists and belongs to user
      const [categories] = await connection.execute(
        'SELECT created_by FROM categories WHERE id = ?',
        [id]
      );

      if (categories.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'Category not found',
          code: 404
        });
      }

      if (categories[0].created_by !== userId) {
        await connection.release();
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this category',
          code: 403
        });
      }

      // Build update query dynamically
      const updates = [];
      const values = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }

      if (updates.length === 0) {
        await connection.release();
        return res.status(400).json({
          status: 'error',
          message: 'No fields to update',
          code: 400
        });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;

      await connection.execute(query, values);

      await connection.release();

      res.json({
        status: 'success',
        message: 'Category updated successfully',
        code: 200
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Check if category exists and belongs to user
      const [categories] = await connection.execute(
        'SELECT created_by FROM categories WHERE id = ?',
        [id]
      );

      if (categories.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'Category not found',
          code: 404
        });
      }

      if (categories[0].created_by !== userId) {
        await connection.release();
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to delete this category',
          code: 403
        });
      }

      // Note: Products with this category will be deleted due to ON DELETE CASCADE
      await connection.execute('DELETE FROM categories WHERE id = ?', [id]);

      await connection.release();

      res.json({
        status: 'success',
        message: 'Category deleted successfully',
        code: 200
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  }
};
