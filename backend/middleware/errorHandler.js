// Central error handler -- keep controllers throwing plain Errors (optionally
// with a `.status`) and let this format the response consistently.
function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: status === 500 ? 'Something went wrong. Please try again.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
