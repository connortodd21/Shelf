var nodemailer = require('nodemailer');

var email_address = "ultimateshelf01@gmail.com"

function mailer(to, subject, body) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: email_address,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: email_address,
        to: to,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            // console.log('Email sent: ' + info.response);
            return;
        }
    });
}

module.exports = mailer;