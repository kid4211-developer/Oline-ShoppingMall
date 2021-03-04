const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = mongoose.Schema(
    {
        toUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        toBank: {
            type: String,
        },
        toAccountNumber: {
            type: String,
        },
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        fromBank: {
            type: String,
        },
        fromAccountNumber: {
            type: String,
        },
        amount: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };
