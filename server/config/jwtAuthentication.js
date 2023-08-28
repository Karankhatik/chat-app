const jwt = require("jsonwebtoken");

function authenticate(req,res,next){
         
    const authHeader = req.headers['authorization']; // or req.headers['Authorization']

    // bearer token is sent in the folloeing format - Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        res.send({success: false});
    }else{
        jwt.verify( token, process.env.JWT_SECRET_KEY, function(err,user){
            if(err) res.send({success: false});
            else{
                req.user = user;
                next();
            }
        });
    }

}

module.exports = authenticate;