import nodemailer from 'nodemailer';
export const sendEmailService = async ({
    to,
    subject = "",
    textMessage = "",
    htmlMessage = "",
    attachments = [],
} = {}) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'aabdalnaby073@gmail.com',
            pass: 'wkwuafmiaoluhoyg',
        },
    });

    const info = await transporter.sendMail({
        from: '"No Reply" <aabdalnaby073@gmail.com>',
        to: to ? to : '',
        subject,
        text: textMessage,
        html: htmlMessage,
        attachments,
    });

    return info;
};