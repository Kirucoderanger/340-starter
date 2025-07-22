const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate

/*
  validate.register = [
    body("account_firstname")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("First name must be between 2 and 100 characters."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Last name must be between 2 and 100 characters."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address.")
      .custom(async (value) => {
        const existingUser = await utilities.db.getUserByEmail(value)
        if (existingUser) {
          throw new Error("Email address is already in use.")
        }
      }),
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
      .withMessage("Password must contain at least 1 number, 1 capital letter, and 1 special character."),
  ]

  validate.login = [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address."),
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
      .withMessage("Password must contain at least 1 number, 1 capital letter, and 1 special character."),
  ]

  validate.result = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }

  module.exports = validate
*/