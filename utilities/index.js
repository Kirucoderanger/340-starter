const { name } = require("ejs")
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
  let html = '<div class="inventory-item-details">'
  html += '<div class="inventory-detail-image">' 
  html += '<img src="' + data.inv_image + '" alt="' + data.inv_make + ' ' + data.inv_model + '"> </div>'
  html += '<div class="inventory-detail-info">'
  html += '<h1>' + data.inv_make + ' ' + data.inv_model + ' ' + 'Details</h1>'
  html += '<p>Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  html += '<p>Description: ' + data.inv_description + '</p>'
  html += '<p>Color: ' + data.inv_color + '</p>'
  html += '<p>Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p> </div>'
 
    html += '</div>'
  return html
}


Util.accountForm = function (formType) {
  let form = `<form action="/account/${formType}" method="post">`
  if (formType === "login") {
    form += `<label for="email">Email Address:</label>
             <input type="email" id="email" name="email" required>`
  }
  form += `<label for="password">Password:</label>
           <input type="password" id="password" name="password" required>`
  if (formType === "register") {
    form += `<label for="confirmPassword">Confirm Password:</label>
             <input type="password" id="confirmPassword" name="confirmPassword" required>`
  }
  form += `<button type="submit">${formType.charAt(0).toUpperCase() + formType.slice(1)}</button></form>`
  return form
}

Util.addClassificationForm = function () {
  return `<div class="classification-container">
  <div class="form-wrapper">
    <h2>Add New Classification</h2>
    <p class="form-instructions">
      Classification name must contain only letters and numbers. <br>
      <strong>No spaces or special characters</strong> are allowed.
    </p>

    <form action="/inv/add-classification" method="post" class="classification-form" >
      <label for="classification_name">Classification Name</label>
      <input
        type="text"
        id="classification_name"
        name="classification_name"
        required
        pattern="^[A-Za-z0-9]+$"
        title="Only letters and numbers are allowed. No spaces or special characters."
        placeholder="e.g. Sedan, SUV, Truck"
      >
      <button type="submit">Add Classification</button>
    </form>
  </div>
</div>`
}


Util.buildClassificationList = async function (classification_id = null) {
  
    let data = await invModel.getClassifications()
    let classificationList =
      '<form><select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select></form>"
    return classificationList
  }


Util.addInventoryForm = async function (classification_id = null, formData = {}) {
  const data = await invModel.getClassifications()

  let addInventory = '<div class="add-inventory-form-wrapper"><form action="/inv/add-inventory" method="post" class="inventory-form">'

  // Classification Dropdown
  /*addInventory += `
    <div class="form-group">
      <label for="classification_id">Classification:</label>
      <select name="classification_id" id="classification_id" required>
        <option value="">Choose a Classification</option>`

  data.rows.forEach((row) => {
    const selected = classification_id == row.classification_id ? "selected" : ""
    addInventory += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`
  })

  addInventory += `</select>
    </div>`*/

    const selectedValue = formData.classification_id || classification_id

addInventory += `
  <div class="form-group">
    <label for="classification_id">Classification:</label>
    <select name="classification_id" id="classification_id" required>
      <option value="">Choose a Classification</option>`

data.rows.forEach((row) => {
  const selected = selectedValue == row.classification_id ? "selected" : ""
  addInventory += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`
})

addInventory += `</select>
  </div>`


  // Form Fields
  const fields = [
    { id: 'inv_make', label: 'Make', type: 'text', required: true, pattern: '.{3,}', title: 'At least 3 characters' },
    { id: 'inv_model', label: 'Model', type: 'text', required: true, pattern: '.{3,}', title: 'At least 3 characters' },
    { id: 'inv_year', label: 'Year', type: 'number', required: true, pattern: '\\d{4}', title: '4-digit year', min: 1900, max: new Date().getFullYear() + 1 },
    { id: 'inv_description', label: 'Description', type: 'text', required: true },
    { id: 'inv_image', label: 'Image Path', type: 'text', required: true },
    { id: 'inv_thumbnail', label: 'Thumbnail Path', type: 'text', required: true },
    { id: 'inv_price', label: 'Price', type: 'number', required: true, step: '0.01', min: '0' },
    { id: 'inv_miles', label: 'Miles', type: 'number', required: true, min: '0' },
    { id: 'inv_color', label: 'Color', type: 'text', required: true },
  ]

  for (const field of fields) {
    const value = formData[field.id] || ""
    addInventory += `
      <div class="form-group">
        <label for="${field.id}">${field.label}:</label>
        <input 
          type="${field.type}" 
          id="${field.id}" 
          name="${field.id}" 
          value="${value}"
          ${field.required ? 'required' : ''} 
          ${field.pattern ? `pattern="${field.pattern}"` : ''} 
          ${field.title ? `title="${field.title}"` : ''} 
          ${field.step ? `step="${field.step}"` : ''} 
          ${field.min ? `min="${field.min}"` : ''} 
          ${field.max ? `max="${field.max}"` : ''} 
        >
      </div>`
  }

  addInventory += `
    <div class="form-group">
      <button type="submit">Add Inventory</button>
    </div>
  </form></div>`

  return addInventory
}




/*Util.addInventoryForm = async function (classification_id = null) {
  //const classificationList = Util.buildClassificationList();
  let data = await invModel.getClassifications();
  console.log(data);
  
  // Build the form HTML
  let addInventory = '<form action="/inventory/add-inventory" method="post">'
  addInventory += '<label for="inv_make">Make:</label>'
  addInventory += '<input type="text" id="inv_make" name="inv_make" required>'
  addInventory += '<label for="inv_model">Model:</label>'
  addInventory += '<input type="text" id="inv_model" name="inv_model" required>'
  
  addInventory += '<label for="classification_id">Classification:</label>'
  addInventory += '<select name="classification_id" id="classification_id" required>'
  addInventory += '<option value="">Choose a Classification</option>'
  data.rows.forEach((row) => {
    addInventory += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      addInventory += ' selected'
    }
    addInventory += '>' + row.classification_name + '</option>'
  })
  addInventory += '</select>'
  addInventory += '<button type="submit">Add Inventory</button>'
  addInventory += '</form>'
  //return addInventory


  


   
  /*return `<form action="/inventory/add-inventory" method="post">
            <label for="inv_make">Make:</label>
            <input type="text" id="inv_make" name="inv_make" required>

            <label for="inv_model">Model:</label>
            <input type="text" id="inv_model" name="inv_model" required>
            ${classificationList}

            <button type="submit">Add Inventory</button>
          </form>`
          return addInventory
}*/




/*
Util.addInventoryForm = async function (classification_id = null) {
  const data = await invModel.getClassifications()

  let addInventory = '<form action="/inv/add-inventory" method="post" class="inventory-form">'

  // Classification first
  addInventory += `
    <div class="form-group">
      <label for="classification_id">Classification:</label>
      <select name="classification_id" id="classification_id" required>
        <option value="">Choose a Classification</option>`

  data.rows.forEach((row) => {
    addInventory += `<option value="${row.classification_id}"${classification_id == row.classification_id ? " selected" : ""}>${row.classification_name}</option>`
  })

  addInventory += `</select>
    </div>`

  // Form Fields
  const fields = [
    { id: 'inv_make', name: 'inv_make', value: '<%locals.inv_make%>', label: 'Make', type: 'text', required: true, pattern: '.{3,}', title: 'At least 3 characters' },
    { id: 'inv_model', name: 'inv_model', value: '<%locals.inv_model%>', label: 'Model', type: 'text', required: true, pattern: '.{3,}', title: 'At least 3 characters' },
    { id: 'inv_year', name: 'inv_year', value: '<%locals.inv_year%>', label: 'Year', type: 'number', required: true, pattern: '\\d{4}', title: '4-digit year', min: 1900, max: new Date().getFullYear() + 1 },
    { id: 'inv_description', name: 'inv_description', value: '<%locals.inv_description%>', label: 'Description', type: 'text', required: true },
    { id: 'inv_image', name: 'inv_image', value: '<%locals.inv_image%>', label: 'Image Path', type: 'text', required: true },
    { id: 'inv_thumbnail', name: 'inv_thumbnail', value: '<%locals.inv_thumbnail%>', label: 'Thumbnail Path', type: 'text', required: true },
    { id: 'inv_price', name: 'inv_price', value: '<%locals.inv_price%>',  label: 'Price', type: 'number', required: true, step: '0.01', min: '0' },
    { id: 'inv_miles', name: 'inv_miles', value: '<%locals.inv_miles%>', label: 'Miles', type: 'number', required: true, min: '0' },
    { id: 'inv_color', name: 'inv_color', value: '<%locals.inv_color%>', label: 'Color', type: 'text', required: true },
  ]

  for (const field of fields) {
    addInventory += `
      <div class="form-group">
        <label for="${field.id}">${field.label}:</label>
        <input 
          type="${field.type}" 
          id="${field.id}" 
          name="${field.id}" 
          ${field.required ? 'required' : ''} 
          ${field.pattern ? `pattern="${field.pattern}"` : ''} 
          ${field.title ? `title="${field.title}"` : ''} 
          ${field.step ? `step="${field.step}"` : ''} 
          ${field.min ? `min="${field.min}"` : ''} 
          ${field.max ? `max="${field.max}"` : ''} 
        >
      </div>`
  }

  addInventory += `
    <div class="form-group">
      <button type="submit">Add Inventory</button>
    </div>
  </form>`

  return addInventory
}*/


Util.managementView = function () {
  return `<h1>Inventory Management</h1>
          <ul>
            <li><a href="/inv/add-classification">Add New Classification</a></li>
            <li><a href="/inv/add-inventory">Add New Inventory Item</a></li>
          </ul>`
}
Util.errorView = function () {
  return `<h1>Error</h1>
          <p>error showcase</p>
          <a href="/">Go back to Home</a>`
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util