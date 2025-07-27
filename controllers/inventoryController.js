const utilities = require("../utilities/")
const invModel = require("../models/inventory-model.js")


// Display Management View
const buildManagementView = async (req, res) => {
    let nav = await utilities.getNav()
    let managementView = utilities.managementView()
  try {
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView
    })
  } catch (error) {
    res.status(500).send("Server Error")
  }
}

// Display Add Classification Form
const buildAddClassification = async (req, res) => {
    let nav = await utilities.getNav()
    let addClassificationForm = utilities.addClassificationForm()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    addClassificationForm,
  })
}

// Display Add Inventory Form
const buildAddInventory = async (req, res) => {
    let nav = await utilities.getNav()
    let addInventoryForm = await utilities.addInventoryForm()
    //let buildClassificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    addInventoryForm,
    //buildClassificationList,
  })
}


/* ***************************
  *  Add a new classification
  * ************************** */

async function addClassification(req, res) {
    let nav = await utilities.getNav()
    let managementView = utilities.managementView()
    let addClassificationForm = utilities.addClassificationForm()
  const classification_name = req.body.classification_name
  //const result = await invModel.addClassification(classification_name)
  const dbResult = await invModel.addClassification(classification_name)

  if (dbResult && dbResult.rowCount > 0) {
        req.flash("notice", `Classification ${classification_name} added successfully.`)
        res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })
  } else {
        req.flash("notice", "Failed to add classification.")
        res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        addClassificationForm,
    })
  }
}


/***********************
 * Add a new inventory item
 */
async function addInventory(req, res) {
  let nav = await utilities.getNav()
  let managementView = utilities.managementView()
  let addInventoryForm = await utilities.addInventoryForm()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id,
  } = req.body

  const dbResult = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id,
  })

  if (dbResult && dbResult.rowCount > 0) {
    req.flash(
      "notice",
      `Inventory item ${inv_make} ${inv_model} added successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
      errors: null, // prevent EJS crash
    })
  }
}

/*
const { validationResult } = require("express-validator")

async function addInventory(req, res) {
  const errors = validationResult(req)

  let nav = await utilities.getNav()
  let managementView = utilities.managementView()
  let addInventoryForm = await utilities.addInventoryForm()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id,
  } = req.body

  // Check for validation errors
  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_color,
      inv_miles,
      inv_image,
      inv_thumbnail,
      classification_id,
    })
  }

  const dbResult = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id,
  })

  if (dbResult && dbResult.rowCount > 0) {
    req.flash(
      "notice",
      `Inventory item ${inv_make} ${inv_model} added successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
      errors: [], // prevent EJS crash
    })
  }
}
*/



/*

async function addInventory(req, res) {
  let nav = await utilities.getNav()
  let managementView = utilities.managementView()
  let addInventoryForm = await utilities.addInventoryForm()
  const { inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id } = req.body

  const dbResult = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id
  })

  if (dbResult && dbResult.rowCount > 0) {
    req.flash("notice", `Inventory item ${inv_make} ${inv_model} added successfully.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
    })
  }
}
*/


module.exports = {
  buildManagementView,
  buildAddClassification,
  buildAddInventory,
  addClassification,
  addInventory
}
