const express = require('express');
const router = express.Router();
const m2wPerformaInvoiceController = require('../../../controllers/type2.controller/pi.manufacture.to.wholesaler.controller');
const auth = require('../../../middlewares/auth');

// Create and list all invoices (with filtering & pagination)
router
  .route('/')
  .post(
    auth('manufacture'),
    m2wPerformaInvoiceController.createInvoice
  )
  .get(
    auth('manufacture', 'wholesaler'),
    m2wPerformaInvoiceController.getAllInvoices
  );

// Get, update, patch deliveryItems, and delete by ID
router
  .route('/:id')
  .get(
    auth('manufacture', 'wholesaler'),
    m2wPerformaInvoiceController.getInvoiceById
  )
  .put(
    auth('manufacture'),
    m2wPerformaInvoiceController.updateInvoice
  )
  .patch(
    auth('manufacture'),
    m2wPerformaInvoiceController.updateInvoice
  )
  .delete(
    auth('manufacture'),
    m2wPerformaInvoiceController.deleteInvoice
  );

// Separate PATCH route to update only delivery items
router
  .route('/:id/delivery-items')
  .patch(
    auth('manufacture'),
    m2wPerformaInvoiceController.updateDeliveryItems
  );

// Get all invoices by manufacturer email
router
  .route('/manufacturer/:manufacturerEmail')
  .get(
    auth('manufacture'),
    m2wPerformaInvoiceController.getInvoicesByManufacturer
  );

module.exports = router;
