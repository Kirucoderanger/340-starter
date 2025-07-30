const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/**
 * Add Classification Validation Rules
 * returns Array of validation rules for adding classification
 */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and Classification name must contain only letters and numbers.No spaces or special characters are allowed.
    
    body("classification_name")
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 100 })
        .withMessage("Classification name must be between 3 and 100 characters.")
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Classification name must contain only letters and numbers. No spaces or special characters are allowed.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error("Classification already exists. Please use a different name.")
            }
        }),
  ]
}

/***
 * Check data and return errors or continue with adding the classification
 */
validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let addClassificationForm = await utilities.addClassificationForm()
    res.render("inventory/add-classification", {
      errors,
      title: "Add new classification",
      nav,
      classification_name,
      addClassificationForm,
      
    })
    return
  }
  next()
}


/*******************
 * Add Inventory Validation Rules
 * returns Array of validation rules for adding inventory
 */
validate.addInventoryRules = () => {
  return [
    
    // inv_year is required and must be a valid year
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Please enter a valid year."),

    // inv_make is required and must be greater than 3 characters
    body("inv_make")
      .trim()
      .notEmpty()
      .isString()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    // inv_model is required and must be greater than 3 characters
    body("inv_model")
      .trim()
      .notEmpty()
      .isString()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    // inv_year is required and must be a valid year
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Please enter a valid year."),
    // inv_price is required and must be an integer or float greater than 0
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please enter a valid price."),
    // inv_description is required and must be a string
    body("inv_description")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Description is required."),
    // inv_color is required and must be a string
    body("inv_color")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Color is required."),
    // inv_miles is required and must be an integer greater than or equal to 0
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    // inv_thumbnail is required and must be a valid URL /images
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+/)
      .withMessage("Thumbnail must be a valid URL starting with /images/"),
    // inv_image is required and must be a valid URL /images
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+/)
      .withMessage("Image must be a valid URL starting with /images/")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    //let addInventoryForm = await utilities.addInventoryForm()
    let addInventoryForm = await utilities.addInventoryForm(req.body.classification_id, req.body)

    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_color,
      inv_miles,
      inv_image,
      inv_thumbnail,
      addInventoryForm,
    })
    return
  }
  next()
}


validate.checkEditInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    //let addInventoryForm = await utilities.addInventoryForm()
    let editInventoryForm = await utilities.editInventoryForm(req.body.inv_id, req.body)

    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_color,
      inv_miles,
      inv_image,
      inv_thumbnail,
      inv_id,
      editInventoryForm,
    })
    return
  }
  next()
}

module.exports = validate