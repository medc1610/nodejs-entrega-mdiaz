import { userModel } from "../dao/models/user.model.js";

export default class UserRepository{
    
    
    async getUserById(id){
        const user = await  userModel.find({_id : id}).lean();
        return user;
    }

    async getAllUsers(){
        const users = await  userModel.find().lean();
        return users;
    }

    async getUserByEmail(email){
        const user = await  userModel.find({email}).lean();
        return user;
    }

    async updateUserRoleById(iduser,newRole){ 
        const respUser = await userModel.updateOne({_id : iduser},{role:newRole}).lean();
        return respUser; 
    }

    async updatePassById(iduser,newPass){ 
        const respUser = await userModel.updateOne({_id : iduser},{password:newPass}).lean();
        return respUser; 
    }

    async updatePassByEmail(email,newPass){ 
        const respUser = await userModel.updateOne({email},{password:newPass}).lean();
        return respUser; 
    }

    async updateLastConnection(email){ 
        const respUser = await userModel.updateOne({email},{last_connection: new Date()}).lean();
        return respUser; 
    }

    async getDocuments(id){ 
        const user = await  userModel.find({ _id : id}).lean();
        return user[0].documents; 
    }

    async updateDocuments(id,newDocuments){ 
        const respUser = await userModel.updateOne({_id : id},{documents: newDocuments}).lean();
        return respUser; 
    }

    async deleteAllUsers(){ 

        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 2);
        
        const response =  await userModel.deleteMany({ last_connection: { $lt: fechaLimite }});
        return response;
    }

    async deleteUserByEmail(pEmail){ 
        
        const response =  await userModel.deleteOne({ email: pEmail });
        return response;
    }

}