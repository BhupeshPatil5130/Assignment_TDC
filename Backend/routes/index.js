const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const notesRoutes = require('./notes');

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/customers/:customerId/notes', notesRoutes);
router.get('/health', controller.checkHealth);

module.exports = router;
