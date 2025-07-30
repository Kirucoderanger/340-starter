const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")

}

/* ***************************
 *  Get details of an inventory item by inventory ID
 * ************************** */
async function getInventoryItemById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("get inventory item by id error " + error)
  }
}


/* ***************************
 *  Get details of a classification by classification ID
 * ************************** */
/*async function getClassificationById(classification_id) {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
       [classification_id]
    )
    return data.rows[0]
  }
*/

//or
/*******
 * for multiple items
  async function getClassifications() {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  }
 */


  /* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("get classifications by id error " + error)
  }
}


/* ***************************
  *  Add a new classification
  * ************************** */

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
    
  } catch (error) {
    console.error("add classification error " + error)
    return error.message
  }
}

  /* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount 
  } catch (error) {
    return error.message
  }
}

/* ***************************
  *  Add a new inventory item
  * ************************** */

/*async function addInventory(inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    console.error("add inventory error " + error)
    return error.message
  }
}
*/


async function addInventory(data) {
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
  } = data

  try {
    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`
    
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    console.error("add inventory error " + error)
    return error.message
  }
}

//update inventory model
async function editInventory(data) {
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
  } = data

  try {
    const sql = `
      UPDATE public.inventory
      SET inv_make = $1, inv_model = $2, inv_year = $3, inv_price = $4,
          inv_description = $5, inv_color = $6, inv_miles = $7,
          inv_image = $8, inv_thumbnail = $9, classification_id = $10
      WHERE inv_id = $11
      RETURNING *`

    return await pool.query(sql, [
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
      inv_id
    ])
  } catch (error) {
    console.error("update inventory error: " + error)
    return null
  }
}



/*
async function editInventory(data) {
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
    
  } = data

  try {
    /*const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`

      const sql =`UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_price = $4, inv_description = $5, inv_color = $6, inv_miles = $7, inv_image = $8, inv_thumbnail = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`

      /*const sql =`UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, 
      inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 
      WHERE inv_id = $11 RETURNING *`
    
    
    return await pool.query(sql, [
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
      inv_id
    ])
  } catch (error) {
    console.error("update inventory error " + error)
    return error.message
  }
}*/

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryItemById, 
  addClassification, 
  checkExistingClassification, 
  addInventory,
  editInventory
}