// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

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

module.exports = router;
