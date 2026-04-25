#!/bin/bash

# Inventory System Database Setup Script

echo "Setting up Inventory System Database..."

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS inventory_system;"

# Load schema
mysql -u root -p inventory_system < schema.sql

echo "✓ Database setup complete!"
echo "You can now start the server with: npm start"
