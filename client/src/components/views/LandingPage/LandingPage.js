import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Icon, Col, Card, Row, Button } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents, price } from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import Title from 'antd/lib/typography/Title';

const { Meta } = Card;

function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(4);
    const [PostSize, setPostSize] = useState(0);
    const [SearchTerm, setSearchTerm] = useState('');
    const [Filters, setFilters] = useState({
        continents: [],
        price: [],
    });

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit,
        };
        getProducts(body);
    }, []);

    const getProducts = (body) => {
        axios.post('/api/product/products', body).then((response) => {
            if (response.data.success) {
                if (body.loadMore) {
                    setProducts([...Products, ...response.data.productInfo]);
                } else {
                    setProducts(response.data.productInfo);
                }
                setPostSize(response.data.postSize);
                console.log('여행 상품 리스트', response.data.productInfo);
            } else {
                alert('상품 불러오기를 실패했습니다.');
            }
        });
    };

    const loadMoreHandler = () => {
        let skip = Skip + Limit;
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
            serchTerm: SearchTerm,
        };
        getProducts(body);
        setSkip(skip);
    };

    const renderCards = Products.map((product, index) => {
        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <Card
                    cover={
                        <a href={`/product/${product._id}`}>
                            <ImageSlider images={product.images} />
                        </a>
                    }
                >
                    <Meta title={product.title} description={`$${product.price}`} />
                </Card>
            </Col>
        );
    });

    const showFilteredResults = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters,
        };
        getProducts(body);
        setSkip(0);
        setFilters(filters);
    };

    const handlePrice = (value) => {
        const data = price;
        let array = [];
        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    };

    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters };
        newFilters[category] = filters; //새로운 체크요소를 할당

        if (category === 'price') {
            let priceValues = handlePrice(filters);
            newFilters[category] = priceValues;
        }
        console.log(category, newFilters);
        showFilteredResults(newFilters);
        setFilters(newFilters);
    };

    const updateSearchTerm = (newSearchTerm) => {
        const body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm,
        };
        setSkip(0);
        setSearchTerm(newSearchTerm);
        getProducts(body);
    };

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            {/* Page Title */}
            <div style={{ textAlign: 'center' }}>
                <Title level={2}>
                    Let's Travel Anywhere &nbsp;
                    <Icon type="rocket" />
                </Title>
                <br />
                <hr />
            </div>

            {/* Filter */}
            <Row gutter={[8, 8]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox
                        list={continents}
                        handleFilters={(filters) => handleFilters(filters, 'continents')}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox
                        list={price}
                        handleFilters={(filters) => handleFilters(filters, 'price')}
                    />
                </Col>
            </Row>

            {/* Search */}
            {/* <SearchDiv> */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature refreshFunction={updateSearchTerm} />
            </div>
            {/* </SearchDiv> */}

            {/* Cards */}
            <div>
                <Row gutter={[8, 8]}>{renderCards}</Row>
            </div>
            <br />
            <br />
            {PostSize >= Limit && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={loadMoreHandler}>Load More</Button>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
