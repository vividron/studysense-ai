const errorHandler = (err, req, res, next) => {

  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  let message = "Something went wrong. Please try again later.";

  // Auth errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication failed. Please login again.";
  }

  // File upload limit
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "Uploaded file is too large.";
  }

  // Duplicate data
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate data already exists.";
  }

  // MongoDB network error
    if(err.name === 'MongoNetworkError'){
        message = 'Server down please try agaian later';
        statusCode = 503;
    }

  // AI error
  if (err.type === "rateLimit") {
    message = err.message;
  }

  if (err.type === "tokenLimit") {
    message = err.message;
  }

  // Pdf error
  if (err.type === "pdf") {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

export default errorHandler;
