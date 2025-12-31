const express = require("express");
const auth = require("../../../middlewares/auth");
const { manufactureBOMController } = require("../../../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manufacture", "superadmin"),
    manufactureBOMController.createBOM
  )
  .get(
    auth("manufacture", "superadmin"),
    manufactureBOMController.getBOMs
  );

router
  .route("/by-design-color")
  .get(
    auth("manufacture", "superadmin"),
    manufactureBOMController.getBOMByDesignColor
  );

router
  .route("/:id")
  .get(auth("manufacture", "superadmin"), manufactureBOMController.getBOMById)
  .patch(auth("manufacture", "superadmin"), manufactureBOMController.updateBOMById)
  .delete(auth("manufacture", "superadmin"), manufactureBOMController.deleteBOMById);

router.post(
  "/search",
  auth("superadmin", "manufacture"),
  manufactureBOMController.searchBOM
);

module.exports = router;
