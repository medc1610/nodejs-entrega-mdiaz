import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'

await mongoose.connect(`mongodb+srv://medc1610:medc123456@cluster0.v6ayc2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('Conectado MongoDB'))
    .catch(error => console.log(error))
const requester = supertest('http://localhost:8000');


describe('Test de api Carts', function () {
    it('Get carritos', () => {
        const {ok} = requester.get('/api/cart');
        expect(ok).to.be.ok
    });

    it('Post carrito', () => {
        const cart = {
            products: [],
        }
        const {ok} = requester.post('/api/cart/create').send(cart);
        expect(ok).to.be.ok
    });

    it('Get carrito por id', () => {
        const {ok} = requester.get('/api/cart/65f7620fa4669f45d1491992');
        expect(ok).to.be.ok
    });

});
