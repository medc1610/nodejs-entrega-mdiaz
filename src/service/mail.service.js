import nodemailer from 'nodemailer';
import config from '../config/config.js';


export default class EmailService{
    #transport;
    constructor(){
         this.#transport = nodemailer.createTransport({
            host : config.mail_host,
            port: config.mail_port,
            auth : {
                user    : config.mail_user,
                pass : config.mail_password,
            },
            tls: {
                rejectUnauthorized: false
              }
        });
    }
    async sendEmail(pemailSend,ptitle,ptext,phtml){
       
        const mensaje = {
            from:  config.mail_from, 
            //to : pemailSend,
            to: config.mail_user,
            subject: ptitle, 
            text: ptext, 
            html: phtml, 
          };

        const info = await this.#transport.sendMail(mensaje);
    }
}