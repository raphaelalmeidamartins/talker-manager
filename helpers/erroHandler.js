const errorHandler = (err, _req, res, _next) => {
  res.status(err.status).json({ message: err.message });
};

module.exports = errorHandler;
