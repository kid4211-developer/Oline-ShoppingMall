import React from 'react';
import { Button } from 'antd';
import './UserCardBlock.css';
function UserCardBlock({ products, removeItem }) {
    console.log('cart 목록 조회', products);
    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0];
            return `http://localhost:5000/${image}`;
        }
    };
    const renderItems = () =>
        products &&
        products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img
                        style={{ width: '100px', height: '70px' }}
                        alt="product"
                        src={renderCartImage(product.images)}
                    />
                </td>
                <td>{product.title}</td>
                <td>{product.quantity}EA</td>
                <td>${product.price}</td>
                <td>
                    <Button onClick={() => removeItem(product._id)}>Remove</Button>
                </td>
            </tr>
        ));
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </table>
        </div>
    );
}

export default UserCardBlock;
