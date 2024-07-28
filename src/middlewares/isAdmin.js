const isAdmin = (req,res,next) => {
   
    if (req.session.role ==  'admin') {
        next();
    }
    res.status(401).send();
}

export default isAdmin;