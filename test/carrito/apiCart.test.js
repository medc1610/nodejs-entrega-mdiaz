import {expect} from 'chai';
import supertest from 'supertest';
const requester = supertest('http://localhost:8080');

describe('Test de api Carts', () => {
   
        let carritoId = '';
        
        it('Post carrito', async () =>{

                const {_body}= await requester
                .post('/api/carts');

                carritoId = _body._id;
                expect(_body).to.be.a('object');
                expect(_body).to.have.property('_id');
        });

        it('Get carrito por id', async () =>{
               
                const idCard = carritoId; 
                const {_body}= await requester
                .get(`/api/carts/${idCard}`);
                
                expect(_body).to.be.a('array');
                expect(_body[0]).to.have.property('_id');
        });


        it('Delete carrito', async () =>{

                const idCard = carritoId; 
                const {status}= await requester
                .delete(`/api/carts/${idCard}`);
                expect(status).to.equal(200);
        });
 });