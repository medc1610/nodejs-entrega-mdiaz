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

        res.status(200).send('Usuario logueado');
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            res.status(400).send('Usuario ya existe')
        }

        res.status(200).send('Usuario creado');

    } catch (error) {
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
    res.send(req.status(200).send(req.user));
}
