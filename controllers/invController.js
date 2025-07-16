const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Get inventory item by ID
 * ************************** */
invCont.getInventoryItemById = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const item = await invModel.getInventoryItemById(inventory_id)
  if (!item) {
    return res.status(404).send("Item not found")
  }
  const nav = await utilities.getNav()
  const itemDetails = await utilities.getInventoryItemById(inventory_id)
  res.render("./inventory/inventoryDetail", {
    title: item.inv_make + " " + item.inv_model,
    nav,
    item: itemDetails,
  })
}


module.exports = invCont