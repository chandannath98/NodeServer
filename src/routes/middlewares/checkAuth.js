const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const checkAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.email = decoded.email;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  // Use checkAuth middleware for all routes that require authentication

  
  router.get('/secure', (req, res) => {
    // Only authenticated users can access this route
    res.json({ message: `Welcome, ${req.email}!` });
  });
  
  module.exports = checkAuth;