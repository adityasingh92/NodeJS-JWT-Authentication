const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const userValidator = require('../utilities/validations/userRegister.validation');
const hashPassword = require('../utilities/password-hashing');

dotenv.config();

async function httpRegisterUser(request, response){

    /**
     * checking for request.body
     */
    if(request?.body && Object.keys(request.body).length === 0 && Object.getPrototypeOf(request.body) === Object.prototype){
        return response.status(400).json({
            message: 'No request body found',
        });
    }

    /**
     * checking for user request validity
     */
    const userValidationStatus = userValidator(request?.body);

    if( !userValidationStatus.isValid ){
        return response.status(400).json({
            message: userValidationStatus.message
        });
    } 

    /**
     * checking if email already exists or not.
     */
    const existingEmail = await User.findOne({email : request.body.email});

    if(existingEmail){
        return response.status(409).json({
            message : 'Email already exists'
        });
    }

    try{
        const hashedPassword = await hashPassword(request.body.password);
        
        const user = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
            createdDate: new Date()
        });

        /**
         * sending request to database to add this user
         */
        await user.save();
        return response.status(201).json({
            email: request.body.email,
            username: request.body.username,
            createdDate: new Date()
        })
    }catch(error){
        return response.status(412).json(error);
    }
};

/**
 * generates a JWT for a given secret key.
 * @param {string} username - username of the logged in user
 * @param {string} userId - userId of the logged in user
 */
function generateAccessToken(username, userId){
    const payload = {
        username,
        userId
    }

    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}


async function httpLoginUser(request, response){

    /**
     * checking for request.body
     */
    if(request?.body && Object.keys(request.body).length === 0 && Object.getPrototypeOf(request.body) === Object.prototype){
        return response.status(400).json({
            message: 'No request body found',
        });
    }

    /**
     * checking if given body has email and password properties.
     * if not, invalid request body error would be thrown
     */
    if( !(request.body.hasOwnProperty('email') && request.body.hasOwnProperty('password')) ){
        return response.status(400).json({
            message: 'Invalid request body'
        })
    }

    /**
     * calling all the users with given email and comparing the details
     * if fetched password and given password matches, user is authenticated
     * else error is throws.
     */
    const fetchedUser = await User.findOne({email: request.body.email});

    if( !fetchedUser ){
        return response.status(404).json({
            message: 'Invalid email or password',
        });
    }

    const validPass = await bcrypt.compare(request.body.password, fetchedUser.password);

    if(!validPass){
        return response.status(404).json({
            message: 'Invalid email or password'
        });
    }

    /**
     * if every check is passed sucessfully, a JWT Token would be generated and 
     * sent along as a header
     */
    const token = generateAccessToken(fetchedUser.username, fetchedUser._id);


    return response.status(200).json({
        email: request.body.email,
        username: fetchedUser.username,
        token: token
    })
}

module.exports = {
    httpRegisterUser,
    httpLoginUser
};