/**
 * Account Routes
 */
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")

const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

/**
 * Deliver login view
 * Uses utilities.handleErrors to catch errors in the controller
 */

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//router.get("/myAccount", utilities.handleErrors(accountController.buildMyAccount))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildMyAccount))

//register user in to database
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

//router.post('/register', accountController.registerAccount)
//router.get("/forgot-password", utilities.handleErrors(accountController.buildForgotPassword))
//router.get("/reset-password", utilities.handleErrors(accountController.buildResetPassword))
//router.get("/account", utilities.handleErrors(accountController.buildAccount))

// Process the login attempt
/*router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)*/

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)




module.exports = router;


/*

// Middleware to check if user is authenticated
router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "You must be logged in to view this page.")
    res.redirect("/login")
})


// Route to build the account view
router.get("/", accountController.buildAccountView)
// Route to build the login view
router.get("/login", accountController.buildLoginView)
// Route to build the register view
router.get("/register", accountController.buildRegisterView)
// Route to handle login form submission
router.post("/login", accountController.handleLogin)
// Route to handle registration form submission
router.post("/register", accountController.handleRegister)
// Route to handle logout
router.get("/logout", accountController.handleLogout)
// Route to handle password reset
router.post("/reset-password", accountController.handleResetPassword)
// Route to handle account deletion
router.post("/delete-account", accountController.handleDeleteAccount)
// Route to handle account update
router.post("/update-account", accountController.handleUpdateAccount)
// Route to handle account details view
router.get("/details", accountController.buildAccountDetailsView)
// Route to handle account settings view
router.get("/settings", accountController.buildAccountSettingsView)
// Route to handle account notifications view
router.get("/notifications", accountController.buildAccountNotificationsView)
// Route to handle account preferences view
router.get("/preferences", accountController.buildAccountPreferencesView)
// Route to handle account security view
router.get("/security", accountController.buildAccountSecurityView)
// Route to handle account activity log view
router.get("/activity-log", accountController.buildAccountActivityLogView)
// Route to handle account privacy settings view
router.get("/privacy-settings", accountController.buildAccountPrivacySettingsView)
// Route to handle account subscription management view
router.get("/subscription-management", accountController.buildAccountSubscriptionManagementView)
// Route to handle account billing information view
router.get("/billing-information", accountController.buildAccountBillingInformationView)
// Route to handle account payment methods view
router.get("/payment-methods", accountController.buildAccountPaymentMethodsView)
// Route to handle account transaction history view
router.get("/transaction-history", accountController.buildAccountTransactionHistoryView)
// Route to handle account support view
router.get("/support", accountController.buildAccountSupportView)
// Route to handle account feedback view
router.get("/feedback", accountController.buildAccountFeedbackView)
// Route to handle account terms of service view
router.get("/terms-of-service", accountController.buildAccountTermsOfServiceView)
// Route to handle account privacy policy view
router.get("/privacy-policy", accountController.buildAccountPrivacyPolicyView)*/
