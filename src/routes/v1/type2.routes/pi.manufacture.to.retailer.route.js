const express = require('express');

const router = express.Router();
const { m2rPerformaInvoiceController } = require('../../../controllers');
const auth = require('../../../middlewares/auth'); // Uncomment if using role-based auth

// Create and list all invoices (with filtering & pagination)
router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), // Add auth if needed
    m2rPerformaInvoiceController.createInvoice
  )
  .get( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getAllInvoices);

// Get, update, patch deliveryItems, and delete by ID
router
  .route('/:id')

  .get( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getInvoiceById)
  .put( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.updateInvoice)
  .patch( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.updateDeliveryItems)
  .delete( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.deleteInvoice);

// Get all invoices by manufacturer email (direct fetch)
router
  .route('/manufacturer/:manufacturerEmail')
  .get( auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getInvoicesByManufacturer);

router.get(
  '/by-po/:poId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  m2rPerformaInvoiceController.getPerformaInvoiceByPoId
);
router.patch(
  '/mark-return-request/:id',
  m2rPerformaInvoiceController.markReturnRequestGenerated
);
module.exports = router;
