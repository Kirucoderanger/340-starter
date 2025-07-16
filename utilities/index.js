const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  //console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}





/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


Util.getInventoryItemById = async function (inventory_id) {
  let data = await invModel.getInventoryItemById(inventory_id)
  let html = '<h1>' + data.inv_make + ' ' + data.inv_model + '</h1>'
  html += '<p>Model: ' + data.inv_model + '</p>'
  html += '<p>Year: ' + data.inv_year + '</p>'
  html += '<p>Description: ' + data.inv_description + '</p>'
  html += '<p>Image: <img src="' + data.inv_image + '" alt="' + data.inv_make + ' ' + data.inv_model + '"></p>'
  //html += '<p>Thumbnail: <img src="../images/vehicles/' + data.inv_thumbnail + '" alt="' + data.inv_make + ' ' + data.inv_model + ' thumbnail"></p>'
  html += '<p>Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
  html += '<p>Color: ' + data.inv_color + '</p>'
  html += '<p>Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  return html
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util