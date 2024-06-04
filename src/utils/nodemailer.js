import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOptions = {
        from: '',
        to: email,
        subject: 'Cambio de contraseña',
        html: `<p>Haz click en el siguiente enlace para cambiar tu constrseña:</p><button href=${linkChangePassword}>Cambiar contraseña</button>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email enaviado')
        }
    });
}
