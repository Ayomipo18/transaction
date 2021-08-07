const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

sgMail.setApiKey(process.env.SG_KEY);

const composeCreditMail = (email, user, sender, amount, balance) => {
    return {
        to : email,
        from : 'electron@aolamide.me',
        subject : 'Electron Credit Alert',
        html : `Hi, <strong>${user}</strong> <br><br><strong>${sender}</strong> just sent you <strong>e${amount}</strong><br><br>Your new balance is <strong>e${balance}</strong><br><br><br>Cheers.`
    }
}

const composeDebitMail = (email, user, receiver, amount, balance) => {
    return {
        to : email,
        from : 'electron@aolamide.me',
        subject : 'Electron Debit Alert',
        html : `Hi, <strong>${user}</strong> <br><br>You just sent <strong>e${amount}</strong> to <strong>${receiver}</strong><br><br>Your new balance is <strong>e${balance}</strong><br><br><br>Cheers.`
    }
}

module.exports = { sgMail, composeCreditMail, composeDebitMail};