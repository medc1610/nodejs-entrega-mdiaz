const rolUsers = (req,res,next) => {
    req.session.rol ='usuario';
    
    if (req.session.email === 'adminCoder@coder.com' && req.session.password === 'adminCod3r123') {
        req.session.rol = 'admin';
    }
    next();
}

export default rolUsers;