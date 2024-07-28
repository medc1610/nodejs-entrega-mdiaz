const isAdminGlobal = (req,res,next) => {
   
    if (req.session.email === 'adminCoder@coder.com') {
        next();
        return;
    }
    return res.redirect('/login');
}

export default isAdminGlobal;