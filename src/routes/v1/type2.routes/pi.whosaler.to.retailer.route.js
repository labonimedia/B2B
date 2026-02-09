const express = require('express');
const router = express.Router();
const { w2rPerformaInvoiceController } = require('../../../controllers');
const auth = require('../../../middlewares/auth');

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.createInvoice)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.getAllInvoices);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.getInvoiceById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.updateInvoice)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.updateDeliveryItems)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), w2rPerformaInvoiceController.deleteInvoice);

router.get(
  '/wholesaler/:wholesalerEmail',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  w2rPerformaInvoiceController.getInvoicesByWholesaler
);

router.get(
  '/by-po/:poId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  w2rPerformaInvoiceController.getPerformaInvoiceByPoId
);

router.patch(
  '/mark-return-request/:id',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  w2rPerformaInvoiceController.markReturnRequestGenerated
);

module.exports = router;
