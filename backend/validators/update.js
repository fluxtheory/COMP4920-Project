const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateInput(data) {
    let errors = {};

    data.new_email = !isEmpty(data.new_email) ? data.new_email : "";
    data.new_password = !isEmpty(data.new_password) ? data.new_password : "";

    if(Validator.isEmpty(data.new_email)){
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.new_email)){
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.new_password)){
        errors.password = "Password field is required";
    }

    if (!Validator.isLength(data.new_password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}