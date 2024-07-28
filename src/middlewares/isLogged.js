const isLogged = (req,res,next) => {
    if (req.session.isLogged) {
        return res.redirect('/products');
    }
    next();
}

export default isLogged;