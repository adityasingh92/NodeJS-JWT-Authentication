/**
 * This is the locale files for all the label or error text, please refer ./locale/
 */
const { 
    EMAIL_VALIDATION_ERROR, 
    USER_EMPTY,
    MIN_PASSWORD_LENGTH,
    PASSWORD_DIGIT_ERROR,
    PASSWORD_UPPERCASE_ERROR,
    PASSWORD_LOWERCASE_ERROR,
    PASSWORD_SPECIAL_CHARACTER_ERROR,
    INVALID_USERNAME,
    INVALID_USERNAME_CHARACTERS,
    VALID_MESSAGE,
    INVALID_USEROBJECT
} = require('./locale/en');

/**
 * @param {{ email: string, password: string, username: string }} userObject - user schema object
 * @return { {
 *      isValid: boolean,
 *      message: string
 * } } 
 */
function userValidation(userObject){

    /**
     * Check for empty object
     */
    if(userObject && Object.keys(userObject).length === 0 && Object.getPrototypeOf(obj) === Object.prototype){
        return {
            isValid: false,
            message: USER_EMPTY
        };
    }

    /**
     * Object should contain keys - email, username, password
     */
    if( !(userObject.hasOwnProperty('email') && userObject.hasOwnProperty('username') && userObject.hasOwnProperty('password')) ){
        return {
            isValid: false,
            message: INVALID_USEROBJECT
        };
    }

    /**
     * checking if email is valid 
     * VALID -> <..>@<..>.<.> (testuser@test.com)
     */
    const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if( !EMAIL_REGEX.test(userObject?.email) ){
        return {
            isValid: false,
            message: EMAIL_VALIDATION_ERROR
        };
    }

    /**
     * checking for valid password
     * TEST 1: Atleast 8 characters long
     * TEST 2: Must contain atleast one uppercase character
     * TEST 3: Must contain atleast one lower case character
     * TEST 4: Must contain atleast one digit
     * TEST 5: Must contain atleast one speacial character
     */
    function validatePassword(password){
        if(password.length < 8){
            return {
                isValid: false,
                message: MIN_PASSWORD_LENGTH
            }
        }

        if(password.search(/[a-z]/) < 0){
            return {
                isValid: false,
                message: PASSWORD_LOWERCASE_ERROR
            }
        }

        if(password.search(/[A-Z]/) < 0){
            return {
                isValid: false,
                message: PASSWORD_UPPERCASE_ERROR
            }
        }

        if(password.search(/[!@#$%^&*]/) < 0){
            return {
                isValid: false,
                message: PASSWORD_SPECIAL_CHARACTER_ERROR
            }
        }

        if(password.search(/[0-9]/) < 0){
            return {
                isValid: false,
                message: PASSWORD_DIGIT_ERROR
            }
        }
    }

    validatePassword(userObject?.password);

    /**
     * Validating username
     * MIN LENGTH - 4
     * MAX LENGTH - 255
     * Should not have special characters inside it.
     */
    if(userObject?.username){
        if( !/^[a-zA-Z0-9]+$/.test(userObject?.username) ){
            return {
                isValid: false,
                message: INVALID_USERNAME_CHARACTERS
            };
        }
        if(userObject?.username?.length <= 4 || userObject?.username?.length > 255){
            return {
                isValid: false, 
                message: INVALID_USERNAME
            }
        }
    }

    return {
        isValid: true,
        message: VALID_MESSAGE
    }

}

module.exports = userValidation;