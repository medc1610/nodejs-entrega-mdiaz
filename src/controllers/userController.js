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
