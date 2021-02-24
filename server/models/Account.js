const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        bank: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        balance: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);

module.exports = { Account };
