const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  if (isEmpty(data.nameOrEmail)) {
    errors.error = "No email or username supplied.";
  }

  data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.password)) {
    errors.error = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
