import {expect} from 'chai';
import { Cookie } from 'express-session';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Test de api Session', () => { 
   

        it('Get cookie', async () =>{
               
                const {status,_body}= await requester
                .get('/api/session/cookies');
                expect(status).to.equal(200);
        });

        it('Post Login exitoso', async () =>{
               
                const mockUser = {
                        email: "adminCoder@coder.com",
                        password: "adminCod3r123"
                      };

                const response = await requester
                .post('/api/session/login').send(mockUser);
                
                const cookieResult = response.headers['set-cookie'][0].split(';')[0];
                
                expect(cookieResult).to.be.ok;
                const cookie = {
                        name : cookieResult.split('=')[0],
                        value:  cookieResult.split('=')[1]
                };
                expect(cookie.name).to.be.equal('connect.sid');
                expect(cookie.value).to.be.ok;
        });


        it('Post Login no exitoso', async () =>{
               
                const mockUser = {
                        email: "adminCoder@coder.com",
                        password: "adminCod3r123777"
                      };

                const response = await requester
                .post('/api/session/login').send(mockUser);
                
                const cookieResult = response.headers['set-cookie'];
                
                expect(cookieResult).to.be.not.ok;
                
        });

 


 });