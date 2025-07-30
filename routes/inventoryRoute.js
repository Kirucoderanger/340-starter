// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities/")
const classificationValidate = require('../utilities/inventory-validation')
const inventoryValidate = require('../utilities/inventory-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory item details view
router.get("/detail/:inventoryId", invController.getInventoryItemById);
/*router.get("/detail/:inventoryId", async (req, res, next) => {
  const inventoryId = req.params.inventoryId
  const data = await invModel.getInventoryItemDetails(inventoryId)
  const nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.item_name,
    nav,
    item: data
  })
})*/


// Inventory Management View
router.get("/", utilities.handleErrors(inventoryController.buildManagementView))

// Add Classification View
router.get("/add-classification", utilities.handleErrors(inventoryController.buildAddClassification))

// Add Inventory View
router.get("/add-inventory", utilities.handleErrors(inventoryController.buildAddInventory))

//Get inventory for update by classification 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//update inventory 
router.get("/edit-inventory/:inventory_id", utilities.handleErrors(inventoryController.buildUpdateInventory))


// Add Classification POST
router.post("/add-classification",
  classificationValidate.addClassificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
) 

// Add Inventory POST
router.post("/add-inventory",
  inventoryValidate.addInventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
)

// update Inventory POST
router.post("/edit-inventory",
  inventoryValidate.addInventoryRules(),
  inventoryValidate.checkEditInventoryData,
  utilities.handleErrors(inventoryController.editInventory)
)


module.exports = router;
