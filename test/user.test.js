import mongoose from 'mongoose';
import { userModel } from '../src/models/user.js';
import Assert from 'assert';
import varenv from '../src/dotenv.js';
import { type } from 'mocha/lib/utils.js';

const assert = Assert.strict;

await mongoose.connect(varenv.MONGO_DB_URL)
    .then(() => console.log('Conectado MongoDB'))
    .catch(error => console.log(error))


describe('Test CRUD de usuarios en la ruta /api/user', function () {
    before(() => {
        console.log("Arrancando el test")
    })

    beforeEach(() => {
        console.log("Comienza el test")
    })

    it('Obtener todos los usuarios mediante método GET', async () => {
        const user = await userModel.find();
        assert.strictEqual(Array.isArray(user), true);
    })

    it('Obtener un usuario dado su id mediante método GET', async () => {
        const user = await userModel.findById("66661c748260667af56582ba");
        assert.strictEqual(type(user), 'object');
        assert.ok(user._id);
    })

    it('Crear un usuario mediante método POST', async () => {
        const user = new userModel({
            firstName: "Test",
            lastName: "Test",
            email: "test@test2.cl",
            password: "1234",
            edad: 27,
            role: "user"
        })
        const response = await userModel.create(user);
        assert.ok(response._id);
    })


})
