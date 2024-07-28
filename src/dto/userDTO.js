export default class UserDTO{
    #user;
    constructor(puser){
        this.#user = {           
            first_name: puser.first_name,
            last_name: puser.last_name,
            email: puser.email,
            age: puser.age,
            role : puser.role
        }
        
    }
    getUser(){
        return this.#user;
    }

}