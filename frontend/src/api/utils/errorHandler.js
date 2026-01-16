const errorHandler = (error) => {

  // network error
  if (!navigator.onLine) {
    return {
      message: "No internet connection. Please check your network.",
    };
  }

  // request made but no response 
  if (!error.response) {
    return {
      message: "Unable to reach server",
    };
  }

  const data = error.response.data;

  // Validation errors (array)
  if (Array.isArray(data?.error)) {
    console.error(data.error);
    return {
      message: "Invalid inputs",
    };
  }

  // server error (string)
  return {
    message: data?.error || "Unexpected error occurred"
  };
};

export default errorHandler;
