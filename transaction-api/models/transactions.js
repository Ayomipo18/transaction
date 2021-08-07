const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    beneficiary : {
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    time : {
        type : Date,
        default : Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;