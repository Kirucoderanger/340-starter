const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  //let form = utilities.accountForm("login")
  res.render("account/login", {
    title: "Login",
    nav,
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
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
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

/*
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  try {
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash("notice", `Congratulations, ${account_firstname}. Please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed. Try again.")
      return res.status(400).render("account/register", { title: "Register", nav })
    }
  } catch (err) {
    console.error("Caught registration error:", err.message)
    req.flash("notice", "A server error occurred. Try again.")
    return res.status(500).render("account/register", { title: "Register", nav })
  }
}*/




module.exports = { buildLogin, buildRegister, registerAccount }