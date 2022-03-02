const jwt = require('jsonwebtoken');



function verifyToken(req, res, next) {
    // const bearerHeader = req.headers['authorization'];

    // if (typeof bearerHeader !== 'undefined') {
    //     const bearer = bearerHeader.split(' ');
    //     const bearerToken = bearer[1];
    //     jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, authData) => {
    //         if(!err) {
    //             next();
    //         } 
    //         else {
    //             res.status(403).json({"message": "Forbidden(un authorized request)"});
    //         }
    //     })
 
    // }
    // else {
    //     res.status(403).json({"message": "Forbidden(un authorized request)"});
    // }
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({"message": "Access denied"});
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
        return;
    } catch(err) {
        res.status(400).json({"message": "Invalid token"});
        return;
    }
}


module.exports.verifyToken = verifyToken;