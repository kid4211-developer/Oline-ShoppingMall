const express = require('express');
const router = express.Router();
const { Account } = require('../models/Account');

/* =================================
                Blog
================================= */
router.post('/createAccount', (req, res) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    let userAccount = req.body;
    userAccount.date = new Date(Date.UTC(year, month, today));
    console.log('계좌 등록 날짜', userAccount.date);
    const account = new Account(userAccount);
    account.save((err, accountInfo) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({ success: true, accountInfo });
    });
});

router.post('/requestAccount', (req, res) => {
    Account.find({ user: req.body.user })
        .populate('user')
        .exec((err, accounts) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, accounts });
        });
});

module.exports = router;
