import { userModel } from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
}
