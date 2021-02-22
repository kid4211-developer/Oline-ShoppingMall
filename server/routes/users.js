const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const { auth } = require('../middleware/auth');
const async = require('async');
//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

router.post('/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: 'Auth failed, email not found',
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie('w_authExp', user.tokenExp);
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id,
                });
            });
        });
    });
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: '', tokenExp: '' }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
        });
    });
});

router.post('/addToCart', auth, (req, res) => {
    /* User Collection에 해당 user의 정보를 가져오기
     * auth Middleware를 통과하면서 user의 정보가 request 객체에 담기게 됨 (auth 확인 필요) */
    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        // 가져온 정보에서 cart에다 넣으려 하는 상품이 이미 들어 있는지 확인
        let duplicateCheck = false;
        userInfo.cart.forEach((item) => {
            if (item.id === req.body.productId) {
                duplicateCheck = true;
            }
        });

        if (duplicateCheck) {
            // 1. 상품이 이미 있는 경우 : quantity + 1
            User.findOneAndUpdate(
                { _id: req.user._id, 'cart.id': req.body.productId },
                { $inc: { 'cart.$.quantity': 1 } },
                { new: true }, //update된 user 정보를 받기 위해
                (err, userInfo) => {
                    if (err) {
                        return res.status(400).json({ success: false, err });
                    }
                    res.status(200).send(userInfo.cart);
                }
            );
        } else {
            // 2. 상품이 없는 경우
            User.findByIdAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        //입력
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now(),
                        },
                    },
                },
                { new: true },
                (err, userInfo) => {
                    if (err) {
                        return res.status(400).json({ success: false, err });
                    }
                    res.status(200).send(userInfo.cart);
                }
            );
        }
    });
});

router.get('/removeFromCart', auth, (req, res) => {
    // 1. user collection의 cart안에 있는 상품을 지움
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $pull: {
                cart: {
                    id: req.query.id,
                },
            },
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map((item, index) => {
                return item.id;
            });
            // 2. product collection에서 현재 남아있는 상품들의 정보 가져오기
            Product.find({ _id: { $in: array } })
                .populate()
                .exec((err, productInfo) => {
                    if (err) {
                        return res.status(400).json({ success: false, err });
                    }
                    res.status(200).json({ success: false, productInfo, cart });
                });
        }
    );
});

router.post('/successBuy', auth, (req, res) => {
    // 1. User Collection 안에 History filed 안에 간단한 정보 넣어주기
    let history = [];
    let transactionData = {};
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date(Date.UTC(year, month, today, hours, minutes, seconds)),
            name: item.title,
            id: item._id,
            price: item.quantity,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentId,
        });
    });

    // 2. Payment Collection 안에 자세한 결제 정보 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    };
    transactionData.data = req.body.paymentData;
    transactionData.product = history;

    // User - history 저장
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            // payment - transactionData 정보 저장
            const payment = new Payment(transactionData);
            payment.save((err, doc) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }

                // 3. Product Collectiom 안에 있는 sold 필드 정보 업데이트 시키기
                let products = [];
                doc.product.forEach((item) => {
                    products.push({ id: item.id, quantity: item.quantity });
                });

                async.eachSeries(
                    products,
                    (item, callback) => {
                        Product.update(
                            { _id: item.id },
                            {
                                $inc: {
                                    sold: item.quantity,
                                },
                            },
                            { new: false },
                            callback
                        );
                    },
                    (err) => {
                        if (err) {
                            return res.status(400).json({ success: false, err });
                        }
                        res.status(200).json({
                            success: true,
                            cart: user.cart,
                            cartDetail: [],
                        });
                    }
                );
            });
        }
    );
});
module.exports = router;
