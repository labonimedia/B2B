const express = require('express');

const router = express.Router();
const { m2rPerformaInvoiceController } = require('../../../controllers');
const auth = require('../../../middlewares/auth'); // Uncomment if using role-based auth

// Create and list all invoices (with filtering & pagination)
router
  .route('/')
  .post(
    auth('manufacture'), // Add auth if needed
    m2rPerformaInvoiceController.createInvoice
  )
  .get(auth('manufacture', 'retailer'), m2rPerformaInvoiceController.getAllInvoices);

// Get, update, patch deliveryItems, and delete by ID
router
  .route('/:id')

  .get(auth('manufacture', 'retailer'), m2rPerformaInvoiceController.getInvoiceById)
  .put(auth('manufacture'), m2rPerformaInvoiceController.updateInvoice)
  .patch(auth('manufacture'), m2rPerformaInvoiceController.updateDeliveryItems)
  .delete(auth('manufacture'), m2rPerformaInvoiceController.deleteInvoice);

// Get all invoices by manufacturer email (direct fetch)
router
  .route('/manufacturer/:manufacturerEmail')
  .get(auth('manufacture'), m2rPerformaInvoiceController.getInvoicesByManufacturer);

router.get(
  '/by-po/:poId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  m2rPerformaInvoiceController.getPerformaInvoiceByPoId
);
module.exports = router;
