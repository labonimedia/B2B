const express = require('express');

const router = express.Router();
const { m2rPerformaInvoiceController } = require('../../../controllers');
const auth = require('../../../middlewares/auth'); // Uncomment if using role-based auth

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), // Add auth if needed
    m2rPerformaInvoiceController.createInvoice
  )
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getAllInvoices);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getInvoiceById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.updateInvoice)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.updateDeliveryItems)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.deleteInvoice);

router
  .route('/manufacturer/:manufacturerEmail')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), m2rPerformaInvoiceController.getInvoicesByManufacturer);

router.get(
  '/by-po/:poId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  m2rPerformaInvoiceController.getPerformaInvoiceByPoId
);
router.patch('/mark-return-request/:id', m2rPerformaInvoiceController.markReturnRequestGenerated);
module.exports = router;
