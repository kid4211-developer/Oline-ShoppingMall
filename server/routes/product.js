const express = require('express');
const router = express.Router();
const { unlink } = require('fs');
const { Product } = require('../models/Product');
var multer = require('multer');

/*=================================
              Product
=================================*/

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

var upload = multer({ storage: storage }).single('file');

router.post('/image', (req, res) => {
    // 가져온 image를 저장
    upload(req, res, (err) => {
        if (err) {
            return req.json({ success: false, err });
        }
        return res.json({
            success: true,
            filePath: res.req.file.path,
            fileName: res.req.file.filename,
        });
    });
});

router.post('/imageDelete', (req, res) => {
    unlink(req.body.path, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        res.json({ success: true });
    });
});

// 받아온 상품 정보들을 DB에 저장
router.post('/', (req, res) => {
    console.log('여행상품등록', req.body);
    const product = new Product(req.body);
    product.save((err) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        res.status(200).json({ success: true });
    });
});

// Product Collection 상품리스트 불러오기
router.post('/products', (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;
    let findArgs = {};
    for (let key in req.body.filters) {
        // key : continets or price
        if (req.body.filters[key].length > 0) {
            //check된 필터값이 1개라도 있다면
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0], //Greater Than Equal
                    $lte: req.body.filters[key][1], //Less Than Equal
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if (term) {
        Product.find(findArgs)
            .find({ title: { $regex: term, $options: 'i' } })
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }
                res.status(200).json({ success: true, productInfo, postSize: productInfo.length });
            });
    } else {
        Product.find(findArgs)
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }
                res.status(200).json({ success: true, productInfo, postSize: productInfo.length });
            });
    }
});

//productId와 일치하는 상품의 상세정보를 가져옴 (type -> single or array)
router.get('/products_by_id', (req, res) => {
    let type = req.query.type;
    let productIds = req.query.id;
    if (type === 'array') {
        // productIds = "42351235,23523675,2341234" 문자열 형식으로 전달된 배열을
        // ids = 42351235 / 23523675 / 2341234 와 같이 ','를 기준으로 분리해줌
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map((item) => {
            return item;
        });
    }

    Product.find({ _id: { $in: productIds } }) //검색하는 인자값이 여러개인 경우 '$in'을 통해 조회해줌
        .populate('writer')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            res.status(200).send(product);
        });
});

module.exports = router;
