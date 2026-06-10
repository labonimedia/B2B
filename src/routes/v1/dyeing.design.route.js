const express = require('express');
const auth = require('../../middlewares/auth');
const { dyeingDesignController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dyeingDesignController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dyeingDesignController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dyeingDesignController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dyeingDesignController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dyeingDesignController.deleteById);

module.exports = router;
