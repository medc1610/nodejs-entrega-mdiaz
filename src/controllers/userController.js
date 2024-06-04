import { userModel } from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.logger.info(`Usuarios obtenidos correctamente: ${users} - ${new Date().toLocaleDateString()}`)
        res.status(200).send(users);
    } catch (error) {
        res.logger.error(`Error al obtener los usuarios ${error} - ${new Date().toLocaleDateString()}`)
        res.status(500).send(`Error: ${error}`);
    }
}


export const updateUserPremiumRoleById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findOne(id);
        if (user) {
            let newRole = user.role;
            if (newRole === 'user') {
                newRole = 'premium';
            } else if (newRole === 'premium') {
                newRole = 'user';
            }
            await userModel.updateOne(id, newRole);
           res.status(200).send('Usuario actualizado');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (e) {
        res.status(500).send(`Error: ${error}`);
    }
}
