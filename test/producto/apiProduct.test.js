import {expect} from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Test de api products', () => { 
   
        let productId = '';
       

        
        it('Post producto', async () =>{

                const product = {
                title : "Néctar Guallarauco Mango- test",
                description : "Néctar Guallarauco Mango 0% Azúcar Añadida 1 L",
                code: "BIGFHH",
                price : 1000,
                stock : 66,
                status :true,
                category : "Bebestible",
                thumbnails : []
                };

                const {_body}= await requester
                .post('/api/products')
                .send(product);
                productId = _body._id;
                expect(_body).to.have.property('_id');
        });

        it('Get producto por id', async () =>{

                const idProduct = productId; 
                const {_body}= await requester
                .get(`/api/products/${idProduct}`);
                
                expect(_body).to.be.a('array');
                expect(_body[0]).to.have.property('_id');
        });


        it('Delete producto', async () =>{

                const idProduct = productId; 
                const {status}= await requester
                .delete(`/api/products/${idProduct}`);
                expect(status).to.equal(200);
        });

 });