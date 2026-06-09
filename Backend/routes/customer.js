const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const { protect } = require('../middlewares/authMiddleware');

router.post('/seed', customerController.seedDummyProfiles); 
router.get('/', protect, customerController.getCustomers);
router.post('/', protect, customerController.createCustomer);
router.get('/:id', protect, customerController.getCustomerDetails);
router.put('/:id', protect, customerController.updateCustomer);
router.delete('/:id', protect, customerController.deleteCustomer);
router.get('/:id/matches', protect, customerController.getMatches);
router.post('/:id/send-match', protect, customerController.sendMatch);

module.exports = router;
