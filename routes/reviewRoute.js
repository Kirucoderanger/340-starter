const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/")
const inventoryValidate = require('../utilities/inventory-validation')

router.post("/detail",
    inventoryValidate.addReviewRules(),
    inventoryValidate.checkReviewData, 
    utilities.handleErrors(reviewController.postReview));
router.post("/add",
    inventoryValidate.addReviewRules(),
    inventoryValidate.checkReviewData, 
    utilities.handleErrors(reviewController.postReview));


module.exports = router;

