const express = require('express');
const router = express.Router();
const { Account } = require('../models/Account');
const { User } = require('../models/User');
const { Transaction } = require('../models/Transaction');
const moment = require('moment');

/* =================================
               Account
================================= */
router.post('/requestTransaction', (req, res) => {
    Transaction.find({ $or: [{ fromUser: req.body.userId }, { toUser: req.body.userId }] })
        .populate('fromUser')
        .populate('toUser')
        .exec((err, transactionList) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, transactionList });
        });
});

router.post('/getTransferListByDate', (req, res) => {
    const startDate = new Date(moment(req.body.startDate).format('YYYY-MM-DD'));
    const endDate = new Date(moment(req.body.endDate).format('YYYY-MM-DD'));
    endDate.setDate(endDate.getDate() + 1);
    console.log('startDate :', startDate);
    console.log('endDate :', endDate);
    console.log('User Name :', req.body.userId);
    Transaction.find({
        $and: [
            { $or: [{ fromUser: req.body.userId }, { toUser: req.body.userId }] },
            { createdAt: { $gte: startDate, $lte: endDate } },
        ],
    })
        .populate('fromUser')
        .populate('toUser')
        .exec((err, transactionList) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, transactionList });
        });
});

router.post('/getTransferListByName', (req, res) => {
    User.findOne({ name: req.body.searchName }).exec((err, userInfo) => {
        if (err) {
            return res.status(400).send(err);
        }
        console.log('User Name :', req.body.userId);
        console.log('Search Name :', userInfo._id);
        Transaction.find({
            $or: [
                { fromUser: req.body.userId, toUser: userInfo._id },
                { fromUser: userInfo._id, toUser: req.body.userId },
            ],
        })

            .populate('fromUser')
            .populate('toUser')
            .exec((err, list) => {
                if (err) {
                    return res.status(400).send(err);
                }

                return res.status(200).json({ success: true, list });
            });
    });
});

router.post('/createAccount', (req, res) => {
    const nowTime = moment().format('YYYY-MM-DD HH:MM:DD');
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
    let toAmount = parseInt(req.body.amount, 10);
    let fromAmount = -1 * toAmount;
    const nowTime = moment().format('YYYY-MM-DD HH:mm');
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    const transferDate = new Date(Date.UTC(year, month, today, hours, minutes, seconds));
    /* 유효성 검사 */
    User.findOne({
        accounts: {
            $elemMatch: { bank: req.body.fromBankName, accountNumber: req.body.fromAccountNumber },
        },
    }).exec((err, fromUserInfo) => {
        if (!fromUserInfo) {
            return res.json({ success: false, message: 'From : Check account information' });
        }
        User.findOne({
            accounts: {
                $elemMatch: { bank: req.body.toBankName, accountNumber: req.body.toAccountNumber },
            },
        }).exec((err, toUserInfo) => {
            if (!toUserInfo) {
                return res.json({ success: false, message: 'To : Check account information' });
            }
            Account.findOneAndUpdate(
                {
                    $and: [
                        { bank: req.body.fromBankName },
                        { accountNumber: req.body.fromAccountNumber },
                    ],
                },
                { $inc: { balance: fromAmount } },
                { new: true },
                (err, fromInfo) => {
                    if (err) {
                        return res.status(400).json({ success: false, err });
                    }
                    User.findOne({
                        accounts: { $elemMatch: { accountNumber: req.body.toAccountNumber } },
                    }).exec((err, toUserInfo) => {
                        if (err) {
                            return res.status(400).json({ success: false, err });
                        }
                        let fromTransferInfo = {
                            fromName: req.body.userName,
                            fromBank: req.body.fromBankName,
                            fromAccountNumber: req.body.fromAccountNumber,
                            fromImage: req.body.userImage,
                            toName: toUserInfo.name,
                            toBank: req.body.toBankName,
                            toAccountNumber: req.body.toAccountNumber,
                            toImage: toUserInfo.image,
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
                                    return res.json({ success: false, err });
                                }
                                Account.findOneAndUpdate(
                                    {
                                        $and: [
                                            { bank: req.body.toBankName },
                                            { accountNumber: req.body.toAccountNumber },
                                        ],
                                    },
                                    { $inc: { balance: toAmount } },
                                    { new: true },
                                    (err, toInfo) => {
                                        if (err) {
                                            return res.json({ success: false, err });
                                        }
                                        User.findOne({
                                            accounts: {
                                                $elemMatch: {
                                                    accountNumber: req.body.toAccountNumber,
                                                },
                                            },
                                        }).exec((err, toUserInfo) => {
                                            if (err) {
                                                return res.json({ success: false, err });
                                            }
                                            let toTransferInfo = {
                                                fromName: req.body.userName,
                                                fromBank: req.body.fromBankName,
                                                fromAccountNumber: req.body.fromAccountNumber,
                                                fromImage: req.body.userImage,
                                                toName: toUserInfo.name,
                                                toBank: req.body.toBankName,
                                                toAccountNumber: req.body.toAccountNumber,
                                                toImage: toUserInfo.image,
                                                amount: toAmount,
                                                date: nowTime,
                                                type: 'receive',
                                            };
                                            User.findOneAndUpdate(
                                                { _id: toUserInfo._id },
                                                { $push: { transfers: toTransferInfo } },
                                                { new: true },
                                                (err, doc) => {
                                                    if (err) {
                                                        return res.json({
                                                            success: false,
                                                            err,
                                                        });
                                                    }
                                                    const transactionInfo = {
                                                        fromUser: req.body.user,
                                                        fromBank: req.body.fromBankName,
                                                        fromAccountNumber:
                                                            req.body.fromAccountNumber,
                                                        toUser: toUserInfo._id,
                                                        toBank: req.body.toBankName,
                                                        toAccountNumber: req.body.toAccountNumber,
                                                        amount: toAmount,
                                                        date: transferDate,
                                                    };
                                                    const transaction = new Transaction(
                                                        transactionInfo
                                                    );
                                                    transaction.save((err, doc) => {
                                                        if (err) {
                                                            return res
                                                                .status(400)
                                                                .json({ success: false, err });
                                                        }
                                                    });
                                                }
                                            );
                                        });
                                    }
                                );
                                res.json({ success: true, transfers: doc.transfers });
                            }
                        );
                    });
                }
            );
        });
    });
});

module.exports = router;
