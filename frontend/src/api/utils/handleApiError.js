const handleApiError = (error) => {
    // No internet / network error
  if (!error.response) {
    return {
      type: "network",
      message: "No internet connection. Please check your network."
    };
  }
  // Backend error
  return {
    type: "server",
    message: error.response?.data?.error || "Unexpected error occurred"
  };
};

export default handleApiError;
