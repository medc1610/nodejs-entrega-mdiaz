const isRolProductAdd = (req,res,next) => {
   
    if (req.session.role ==  'admin' || req.session.role ==  'premium') {
        next();
    }
    res.status(401).send();
}

export default isRolProductAdd;