const express = require('express');
const router = express.Router();
const { Account } = require('../models/Account');
const { User } = require('../models/User');
const moment = require('moment');

/* =================================
               Account
================================= */
router.post('/createAccount', (req, res) => {
    const nowTime = moment().format('YYYY-MM-DD');
    let userAccount = req.body;
    console.log('userAccount', userAccount);
    console.log('계좌 등록 날짜', nowTime);
    userAccount.date = nowTime;
    const account = new Account(userAccount);
    let insertAccount = {
        bank: req.body.bank,
        accountNumber: req.body.accountNumber,
    };

    account.save((err, accountInfo) => {
        if (err) {
            return res.json({ success: false, err });
        }
        User.findOneAndUpdate(
            { _id: req.body.user },
            { $push: { accounts: insertAccount } },
            { new: true },
            (err, user) => {
                if (err) {
                    return res.json({ success: false, err });
                }
                res.status(200).json({ success: true, accountInfo: user.accounts });
            }
        );
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

router.post('/deleteAccount', (req, res) => {
    req.body.map((account) => {
        Account.findOneAndDelete({ _id: account }, (err, accountInfo) => {
            console.log('삭제 계좌 정보', accountInfo);
            if (err) {
                return res.json({ success: false, err });
            }
            User.findOneAndUpdate(
                { accounts: { $elemMatch: { accountNumber: accountInfo.accountNumber } } },
                {
                    $pull: {
                        accounts: {
                            accountNumber: accountInfo.accountNumber,
                        },
                    },
                },
                { new: true },
                (err, userInfo) => {
                    if (err) {
                        return res.json({ success: false, err });
                    }
                    console.log('삭제계정정보', userInfo);
                    res.json({ success: true, accounts: userInfo.accounts });
                }
            );
        });
    });
});

router.post('/transfer', (req, res) => {
    console.log(req.body);
    let toAmount = parseInt(req.body.amount, 10);
    let fromAmount = -1 * toAmount;
    const nowTime = moment().format('YYYY-MM-DD HH:mm');
    Account.findOneAndUpdate(
        { $and: [{ bank: req.body.fromBankName }, { accountNumber: req.body.fromAccountNumber }] },
        { $inc: { balance: fromAmount } },
        { new: true },
        (err, fromInfo) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            User.find({
                accounts: { $elemMatch: { accountNumber: req.body.toAccountNumber } },
            }).exec((err, toUserInfo) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }
                console.log('받는사람 이름', toUserInfo[0].name);
                let fromTransferInfo = {
                    fromName: req.body.userName,
                    fromBank: req.body.fromBankName,
                    fromAccountNumber: req.body.fromAccountNumber,
                    fromImage: req.body.userImage,
                    toName: toUserInfo[0].name,
                    toBank: req.body.toBankName,
                    toAccountNumber: req.body.toAccountNumber,
                    toImage: toUserInfo[0].image,
                    amount: toAmount,
                    date: nowTime,
                    type: 'send',
                };
                User.findOneAndUpdate(
                    { _id: req.body.user },
                    { $push: { transfers: fromTransferInfo } },
                    { new: true },
                    (err, doc) => {
                        if (err) {
                            return res.status(400).json({ success: false, err });
                        }
                        res.json({ success: true, transfers: doc.transfers });
                    }
                );
            });
        }
    );
    console.log('받는사람은행', req.body.toBankName);
    console.log('받는사람계좌', req.body.toAccountNumber);
    Account.findOneAndUpdate(
        {
            $and: [{ bank: req.body.toBankName }, { accountNumber: req.body.toAccountNumber }],
        },
        { $inc: { balance: toAmount } },
        { new: true },
        (err, toInfo) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            User.find({
                accounts: { $elemMatch: { accountNumber: req.body.toAccountNumber } },
            }).exec((err, toUserInfo) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }
                let toTransferInfo = {
                    fromName: req.body.userName,
                    fromBank: req.body.fromBankName,
                    fromAccountNumber: req.body.fromAccountNumber,
                    fromImage: req.body.userImage,
                    toName: toUserInfo[0].name,
                    toBank: req.body.toBankName,
                    toAccountNumber: req.body.toAccountNumber,
                    toImage: toUserInfo[0].image,
                    amount: toAmount,
                    date: nowTime,
                    type: 'receive',
                };
                User.findOneAndUpdate(
                    { _id: toUserInfo[0]._id },
                    { $push: { transfers: toTransferInfo } },
                    { new: true },
                    (err, doc) => {
                        if (err) {
                            return res.status(400).json({ success: false, err });
                        }
                    }
                );
            });
        }
    );
});
module.exports = router;
