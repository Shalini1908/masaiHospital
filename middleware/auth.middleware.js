const jwt = require("jsonwebtoken")

const auth = (req,res,next)=>{

let token = req.headers.authorization;

if(token){

const decoded = jwt.verify(token,"masai",(err,decoded)=>{
if(decoded){
    const userID = decoded.userID;
    req.body.userID = userID
    next()
}else{

    res.send({msg:"Please login"})
}

})    
}else{
    res.send({msg:"Please login"})
}

}

module.exports={
    auth
}