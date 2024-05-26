import passport from 'passport';

export const login = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send('Usuario o contraseña incorrectos')
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }
        res.logger.info(`Usuario logueado correctamente: ${req.user.email} - ${new Date().toLocaleDateString()}`)
        res.status(200).send('Usuario logueado');
    } catch (error) {
        res.logger.error(`Error al loguear el usuario ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            res.logger.warning(`Usuario ya existe - ${new Date().toLocaleDateString()}`)
            res.status(400).send('Usuario ya existe')
        }
        res.logger.info(`Usuario creado correctamente: ${req.user.email} - ${new Date().toLocaleDateString()}`)
        res.status(200).send('Usuario creado');

    } catch (error) {
        res.logger.error(`Error al crear el usuario ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}

export const logout = async (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e);
        } else {
            res.redirect('/');
        }
    })
}


export const sessionGithub = async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name,
    }
    res.redirect('/api/products');
}

export const testJWT = async (req, res) => {
    if (req.user.role === 'user') {
        res.status(403).send('Usuario no autorizado')
    } else {
        res.status(200).send(req.user);
    }

}
