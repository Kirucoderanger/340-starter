const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities/")

//router.get("/", errorController.triggerError);
//router.get("/error", errorController.triggerError)
router.get("/error", utilities.handleErrors (errorController.buildErrorView))
// Error handling middleware
//router.use((err, req, res, next) => {   
   // errorController.errorHandler(err, req, res, next);
    //});

module.exports = router;
