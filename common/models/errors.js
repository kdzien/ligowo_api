function setError(message,status){
  let error = new Error(message)
  error.status=status;
  return error;
}

module.exports = setError;
