const isPremium = (req,res,next) => {
   
    if (req.session.role ==  'premium') {
        next();
    }
    res.status(401).send();
}

export default isPremium;