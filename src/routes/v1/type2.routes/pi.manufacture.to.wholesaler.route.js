const express = require('express');

const router = express.Router();
const m2wPerformaInvoiceController = require('../../../controllers/type2.controller/pi.manufacture.to.wholesaler.controller');
const auth = require('../../../middlewares/auth');

router
  .route('/')
  .post(auth('manufacture'), m2wPerformaInvoiceController.createInvoice)
  .get(auth('manufacture', 'wholesaler'), m2wPerformaInvoiceController.getAllInvoices);

router
  .route('/:id')
  .get(auth('manufacture', 'wholesaler'), m2wPerformaInvoiceController.getInvoiceById)
  .put(auth('manufacture'), m2wPerformaInvoiceController.updateInvoice)
  .patch(auth('manufacture'), m2wPerformaInvoiceController.updateInvoice)
  .delete(auth('manufacture'), m2wPerformaInvoiceController.deleteInvoice);

router.route('/:id/delivery-items').patch(auth('manufacture'), m2wPerformaInvoiceController.updateDeliveryItems);

router
  .route('/manufacturer/:manufacturerEmail')
  .get(auth('manufacture'), m2wPerformaInvoiceController.getInvoicesByManufacturer);

module.exports = router;
