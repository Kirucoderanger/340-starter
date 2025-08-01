const utilities = require("../utilities/")
//const invModel = require("../models/inventory-model.js")
const invModel = require("../models/inventory-model")


// Display Management View
const buildManagementView = async (req, res) => {
    let nav = await utilities.getNav()
    let managementView = utilities.managementView()

    const classificationSelect = await utilities.buildClassificationList()


  try {
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
      classificationSelect,
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
    /*res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })*/
    return res.redirect("/inv/") // ✅ Redirect to inventory management page
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



// Display update Inventory Form
const buildUpdateInventory = async (req, res) => {
  const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    let editInventoryForm = await utilities.editInventoryForm(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}` 
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    editInventoryForm,
   
  })
}


// Display delete Inventory Form
const buildDeleteInventory = async (req, res) => {
  const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    let deleteInventoryForm = await utilities.deleteInventoryForm(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}` 
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    deleteInventoryForm,
   
  })
}



/***********************
 * update inventory item controller 
 */

async function editInventory(req, res) {
  let nav = await utilities.getNav()

  const {
    inv_id,
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
  } = req.body

  try {
    const dbResult = await invModel.editInventory({
      inv_id,
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
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/") // ✅ Redirect to inventory management page
    } else {
      throw new Error("No rows updated")
    }
  } catch (err) {
    req.flash("notice", "Failed to update inventory item.")
    const editInventoryForm = await utilities.editInventoryForm(inv_id)
    res.status(500).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      editInventoryForm,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}


/***********************
 * delete inventory item controller 
 */

async function deleteInventory(req, res) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  
  } = req.body

  try {
    const dbResult = await invModel.deleteInventory(inv_id)

    if (dbResult && dbResult.rowCount > 0) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully deleted.`)
      return res.redirect("/inv/") // ✅ Redirect to inventory management page
    } else {
      throw new Error("No rows deleted")
    }
  } catch (err) {
    req.flash("notice", "Failed to delete inventory item.")
    const deleteInventoryForm = await utilities.deleteInventoryForm(inv_id)
    res.status(500).render("inventory/delete-confirm", {
      title: `Delete ${inv_make} ${inv_model}`,
      nav,
      deleteInventoryForm,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
      
    })
  }
}
/*async function editInventory(req, res) {
  let nav = await utilities.getNav()
  let managementView = utilities.managementView()
  let editInventoryForm = await utilities.editInventoryForm()

  const {
    inv_id,
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
    
  } = req.body

  const dbResult = await invModel.editInventory({
    inv_id,
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
    const itemName = dbResult.inv_make + " " + dbResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    /*req.flash(
      "notice",
      `Inventory item ${inv_make} ${inv_model} updated successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      managementView,
    })
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Failed to update inventory item.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      editInventoryForm,
      errors: null, // prevent EJS crash
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}*/





module.exports = {
  buildManagementView,
  buildAddClassification,
  buildAddInventory,
  addClassification,
  addInventory,
  buildUpdateInventory,
  editInventory,
  buildDeleteInventory,
  deleteInventory
}
