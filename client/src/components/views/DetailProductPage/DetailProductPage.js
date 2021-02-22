import { Col, Row } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

function DetailProductPage({ match }) {
    const productId = match.params.productId;
    const [Product, setProduct] = useState({});
    useEffect(() => {
        axios
            .get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then((response) => {
                setProduct(response.data[0]);
            })
            .catch((err) => alert(err));
    }, []);
    return (
        <div style={{ sidth: '100%', padding: '3rem 4rem' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    letterSpacing: '0.5rem',
                    fontWeight: '1500',
                }}
            >
                <h1>{Product.title}</h1>
            </div>
            <br />
            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}>
                    {/* ProductImage */}
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24}>
                    {/* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>
        </div>
    );
}

export default DetailProductPage;
