const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    console.error("Error registering account:", error)
    // Handle error appropriately, e.g., log it or rethrow it
    return error.message
  }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail }


/*async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password, 
        account_type
      ) 
      VALUES ($1, $2, $3, $4, 'client') RETURNING *;
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0] // ✅ return the newly created user row
  } catch (error) {
    console.error("Error registering account:", error.message)
    throw error // ✅ Let controller handle the error
  }
}

module.exports = { registerAccount }*/





/*
const Account = {
  create: async (email, password) => {
    const hashedPassword = await utilities.hashPassword(password)
    const result = await pool.query(
      'INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    )
    return result.rows[0].id
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  // Add more account-related database functions as needed
}*/
/*
async function findAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

module.exports = {
  registerAccount,
  findAccountByEmail
}
const Account = {
  create: async (email, password) => {
    const hashedPassword = await utilities.hashPassword(password)
    const result = await pool.query(
      'INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    )
    return result.rows[0].id
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  // Add more account-related database functions as needed
}*/