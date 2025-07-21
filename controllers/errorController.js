exports.triggerError = (req, res, next) => {
  try {
    // Intentionally throw an error
    throw new Error("Intentional Server Error for Showcase");
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};
