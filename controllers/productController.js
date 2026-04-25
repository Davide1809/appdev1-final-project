const pool = require('../db');

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Get all products for the authenticated user
      const [products] = await connection.execute(
        `SELECT p.id, p.name, p.description, p.category_id, p.quantity, p.price, 
                c.name as category_name, p.created_at, p.updated_at
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.created_by = ?
         ORDER BY p.created_at DESC`,
        [userId]
      );

      await connection.release();

      res.json({
        status: 'success',
        data: products,
        count: products.length,
        code: 200
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Get product by ID
      const [products] = await connection.execute(
        `SELECT p.id, p.name, p.description, p.category_id, p.quantity, p.price, 
                c.name as category_name, p.created_by, p.created_at, p.updated_at
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [id]
      );

      await connection.release();

      if (products.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
          code: 404
        });
      }

      const product = products[0];

      // Check ownership
      if (product.created_by !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to access this product',
          code: 403
        });
      }

      res.json({
        status: 'success',
        data: product,
        code: 200
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, description, category_id, quantity, price } = req.body;
      const userId = req.session.userId;

      // Validation
      if (!name || !category_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Name and category_id are required',
          code: 400
        });
      }

      const connection = await pool.getConnection();

      // Verify category exists and belongs to user
      const [categories] = await connection.execute(
        'SELECT id FROM categories WHERE id = ? AND created_by = ?',
        [category_id, userId]
      );

      if (categories.length === 0) {
        await connection.release();
        return res.status(403).json({
          status: 'error',
          message: 'Category not found or you do not have permission',
          code: 403
        });
      }

      // Insert product
      const [result] = await connection.execute(
        `INSERT INTO products (name, description, category_id, quantity, price, created_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description || null, category_id, quantity || 0, price || 0, userId]
      );

      await connection.release();

      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        productId: result.insertId,
        code: 201
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category_id, quantity, price } = req.body;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Check if product exists and belongs to user
      const [products] = await connection.execute(
        'SELECT created_by FROM products WHERE id = ?',
        [id]
      );

      if (products.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
          code: 404
        });
      }

      if (products[0].created_by !== userId) {
        await connection.release();
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this product',
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
      if (category_id !== undefined) {
        updates.push('category_id = ?');
        values.push(category_id);
      }
      if (quantity !== undefined) {
        updates.push('quantity = ?');
        values.push(quantity);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
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

      const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;

      await connection.execute(query, values);

      await connection.release();

      res.json({
        status: 'success',
        message: 'Product updated successfully',
        code: 200
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const connection = await pool.getConnection();

      // Check if product exists and belongs to user
      const [products] = await connection.execute(
        'SELECT created_by FROM products WHERE id = ?',
        [id]
      );

      if (products.length === 0) {
        await connection.release();
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
          code: 404
        });
      }

      if (products[0].created_by !== userId) {
        await connection.release();
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to delete this product',
          code: 403
        });
      }

      // Delete product
      await connection.execute('DELETE FROM products WHERE id = ?', [id]);

      await connection.release();

      res.json({
        status: 'success',
        message: 'Product deleted successfully',
        code: 200
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500
      });
    }
  }
};
