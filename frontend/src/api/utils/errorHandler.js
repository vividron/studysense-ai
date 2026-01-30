const errorHandler = (error) => {

  // network error
  if (!navigator.onLine) {
    return new Error("No internet connection. Please check your network.");
  }

  // request made but no response 
  if (!error.response) {
    return new Error("Unable to reach server");
  }

  const data = error.response.data;

  // Validation errors (array)
  if (Array.isArray(data?.error)) {
    console.error(data.error);
    return new Error("Invalid inputs");
  }

  // server error (string)
  return new Error(data?.error || "Unexpected error occurred")
};

export default errorHandler;
