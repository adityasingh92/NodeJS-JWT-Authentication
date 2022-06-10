const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function httpGetProtectedContent(request, response){
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')?.[1];

    if(!token){
        return response.status(401).json({
            message: 'Unauthorized access'
        })
    }

    const jwtDecoded = jwt.verify(token, process.env.TOKEN_SECRET, function(error, decoded){
        if(error){
            return {
                status: false,
                message: 'Wrong token'
            }
        }

        return {
            status: true,
            decoded: decoded
        }
    });

    if(!jwtDecoded.status){
        return response.status(401).json(jwtDecoded);
    }

    return response.status(200).json(jwtDecoded.decoded);
}

module.exports = httpGetProtectedContent;