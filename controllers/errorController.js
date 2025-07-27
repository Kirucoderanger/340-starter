const utilities = require("../utilities/")

/*exports.triggerError = (req, res, next) => {
  try {
    // Intentionally throw an error
    throw new Error("Intentional Server Error for Showcase");
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};


exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging
  const nav = utilities.getNav();
  
  // Render a custom error page with the error message
  res.status(500).render("errors/error", {
    title: "Error",
    nav,
    error: err.message || "An unexpected error occurred."
  });
}*
*/
async function buildErrorView(req, res, next) {
  //console.error("Error occurred:", err.message);
  const nav = await utilities.getNav();
  const errorView = await utilities.errorView();
  
  // Render a custom error page with the error message
  res.status(500).render("errors/error", {
    //res.render("errors/error", {
    title: "Error",
    nav,
    errorView,
    //error: null,
    
    error: err.message || "An unexpected error occurred."
  });
}

module.exports = { buildErrorView };