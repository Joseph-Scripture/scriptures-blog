const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const header = req.headers.authorization || '';
    const [scheme, token]= header.split(" ");
    if(scheme !== "Bearer" && !token){
        return res.status(401).json({message:"No token provided"})
    }
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id:decoded.id, email:decoded.email};
        next();
    }catch(err){
        if(err.message === 'TokenExpiredError'){
            return res.status(401).json({message:"Access token expired"})
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports = auth;