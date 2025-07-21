/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

const errorTriggerRoute = require("./routes/errorTrigger");
app.use("/trigger-error", errorTriggerRoute);




/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
/*app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})*/
// Base controller route
//app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory route
app.use("/inv", inventoryRoute)




// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: `Sorry, we appear to have lost that page.  <img loading="lazy" src="https://inzonedesign.com/wp-content/uploads/2021/02/blog-cleverly-funny-creative-404-error-pages-hoppermagic.jpg" alt="404 error page" width="740" height="600"/>`})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
   if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: err }); // Send to your error view
});




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/*
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
    */