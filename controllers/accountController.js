const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver myAccount view
* *************************************** */
async function buildMyAccount(req, res, next) {
  let nav = await utilities.getNav()
  //let form = utilities.accountForm("login")
  res.render("account/myAccount", {
    title: "MY Account",
    nav,
    //form,
  })
}


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  //let form = utilities.accountForm("login")
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
    //form,
  })
}




/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  //let form = utilities.accountForm("register")
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
    
    //form,
  })
}

/* ****************************************
*  Deliver update-account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  //let form = utilities.accountForm("register")
  res.render("account/update-account", {
    title: "update-account",
    nav,
    errors: null
    
    //form,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
    //req.flash("notice", "Please log in.")
    //return res.redirect("/account/login")
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
     //req.flash("notice", "Please log in.")
    //return res.redirect("/account/login")
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process update-account
* *************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body;

  try {
    const dbResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (dbResult && dbResult.rowCount > 0) {
      accountInfo = await accountModel.accountInfo(account_id)
     
      req.flash("notice", `Account updated successfully,<br>First name: ${accountInfo.account_firstname}<br>Last Name: ${accountInfo.account_lastname}<br>Email: ${accountInfo.account_email}.`);
      return res.redirect("/account/");

    } else {
      throw new Error("No rows updated");
    }

  } catch (err) {
    console.error("🔥 Update failed:", err.message);

    req.flash("notice", "Failed to update account.");

    return res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

/* ****************************************
*  Process update account password
* *************************************** */
async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body


// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update password.')
    res.status(500).render("account/update-account", {
      title: "update-account",
      nav,
      errors: null,
    })
  }


  const dbResult = await accountModel.updateAccountPassword(
    account_id,
    hashedPassword
  )

  if (dbResult && dbResult.rowCount > 0) {
    req.flash("notice", `Account password updated successfully.`);
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to update account password.");
    return res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}








module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildMyAccount, 
  buildUpdateAccount,
  updateAccount,
  updateAccountPassword 
}