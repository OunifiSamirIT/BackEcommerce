const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;